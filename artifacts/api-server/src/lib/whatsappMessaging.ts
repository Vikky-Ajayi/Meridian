import { and, eq, isNull } from "drizzle-orm";
import { db, applicationReviewsTable, whatsappMessagesTable } from "@workspace/db";
import { ensureAdminTables } from "./adminTables";
import { type AdminApplication, loadApplications, saveReview, sequenceOver } from "./applications";
import { logger } from "./logger";
import { whatsappDigits } from "./phone";
import { cloudApiConfigured, sendTemplate, WhatsAppError } from "./whatsappCloud";
import { detectChoice, isDue, isOptOut, withinSendingWindow } from "./whatsappRules";
import { fillFirstName, firstNameOf, REPLY_TEMPLATES, SEQUENCE_TEMPLATES, TEMPLATE_LANGUAGE } from "./whatsappTemplates";

// WhatsApp Cloud API automation: the five-message sequence, the scheduler that
// sends follow-ups, and handling of incoming webhooks (replies, button taps,
// opt-outs and delivery statuses).

const RETRY_AFTER_ERROR_MS = 6 * 60 * 60 * 1000;

/** Index (0-based) of the sequence message now due, or null if nothing is due. */
export function dueStep(app: AdminApplication, now: Date): number | null {
  if (app.status !== "approved" || !app.approvedAt || sequenceOver(app)) return null;
  return isDue(new Date(app.approvedAt), app.messagesSent, now) ? app.messagesSent : null;
}

export async function recordMessage(values: typeof whatsappMessagesTable.$inferInsert): Promise<boolean> {
  await ensureAdminTables();
  const inserted = await db
    .insert(whatsappMessagesTable)
    .values(values)
    .onConflictDoNothing({ target: whatsappMessagesTable.metaMessageId })
    .returning({ id: whatsappMessagesTable.id });
  return inserted.length > 0;
}

/** Sends a template to the applicant and records it in the inbox. Throws WhatsAppError on failure. */
export async function sendApplicantTemplate(app: AdminApplication, template: { name: string; text: string }) {
  const to = whatsappDigits(app.whatsappNumber);
  const name = firstNameOf(app.fullName);
  const metaMessageId = await sendTemplate(to, template.name, TEMPLATE_LANGUAGE, name);
  // The message has gone; failing to log it must not make the caller retry the send.
  try {
    await recordMessage({
      waId: to,
      direction: "out",
      referenceNumber: app.reference,
      kind: "template",
      templateName: template.name,
      body: fillFirstName(template.text, name),
      metaMessageId,
      status: "sent",
    });
  } catch (err) {
    logger.error({ err, reference: app.reference, metaMessageId }, "WhatsApp message sent but not saved to the inbox");
  }
}

/**
 * Sends sequence message `index` (0-based, 1–4 for follow-ups) once. The
 * messages_sent counter is claimed first with a conditional update, so two
 * scheduler runs can never send the same step twice.
 */
export async function sendFollowUp(app: AdminApplication, index: number): Promise<void> {
  const claimed = await db
    .update(applicationReviewsTable)
    .set({ messagesSent: index + 1, lastMessageAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(applicationReviewsTable.referenceNumber, app.reference),
        eq(applicationReviewsTable.messagesSent, index),
        isNull(applicationReviewsTable.repliedAt),
        isNull(applicationReviewsTable.followUpsStoppedAt),
        isNull(applicationReviewsTable.optedOutAt),
      ),
    )
    .returning({ id: applicationReviewsTable.id });
  if (claimed.length === 0) return;

  try {
    await sendApplicantTemplate(app, SEQUENCE_TEMPLATES[app.form][index]);
    await db
      .update(applicationReviewsTable)
      .set({ sendError: null, sendErrorAt: null })
      .where(eq(applicationReviewsTable.referenceNumber, app.reference));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ err, reference: app.reference, step: index + 1 }, "WhatsApp follow-up failed");
    await db
      .update(applicationReviewsTable)
      .set({ messagesSent: index, sendError: `Message ${index + 1}: ${message}`, sendErrorAt: new Date(), updatedAt: new Date() })
      .where(and(eq(applicationReviewsTable.referenceNumber, app.reference), eq(applicationReviewsTable.messagesSent, index + 1)));
  }
}

let schedulerRunning = false;

/** Sends every follow-up that's due. Safe to call often; does nothing outside the sending window. */
export async function runFollowUpScheduler(now = new Date()): Promise<void> {
  if (!cloudApiConfigured() || schedulerRunning || !withinSendingWindow(now)) return;
  schedulerRunning = true;
  try {
    const apps = await loadApplications();
    for (const app of apps) {
      const index = dueStep(app, now);
      if (index === null || index === 0) continue;
      if (app.sendErrorAt && now.getTime() - Date.parse(app.sendErrorAt) < RETRY_AFTER_ERROR_MS) continue;
      await sendFollowUp(app, index);
    }
  } catch (err) {
    logger.error({ err }, "WhatsApp follow-up scheduler failed");
  } finally {
    schedulerRunning = false;
  }
}

export function startFollowUpScheduler() {
  const tick = () => void runFollowUpScheduler();
  setTimeout(tick, 60_000).unref();
  setInterval(tick, 10 * 60_000).unref();
  logger.info({ cloudApi: cloudApiConfigured() }, "WhatsApp follow-up scheduler started");
}

// ── Incoming webhooks ──────────────────────────────────────────────────────

interface WebhookMessage {
  from: string;
  id: string;
  type: string;
  text?: { body?: string };
  button?: { text?: string; payload?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
}

interface WebhookStatus {
  id: string;
  status: string;
  errors?: { code?: number; title?: string; message?: string; error_data?: { details?: string } }[];
}

interface WebhookValue {
  contacts?: { wa_id: string; profile?: { name?: string } }[];
  messages?: WebhookMessage[];
  statuses?: WebhookStatus[];
}

function messageText(m: WebhookMessage): string {
  return (
    m.text?.body ??
    m.button?.text ??
    m.interactive?.button_reply?.title ??
    m.interactive?.list_reply?.title ??
    `[${m.type} message]`
  );
}

/** The applicant this number belongs to, preferring one that's been approved, then the newest. */
function matchApplicant(apps: AdminApplication[], waId: string): AdminApplication | null {
  const matches = apps.filter((a) => whatsappDigits(a.whatsappNumber) === waId);
  return matches.find((a) => a.status === "approved") ?? matches[0] ?? null;
}

async function handleIncoming(m: WebhookMessage, profileName: string | undefined, apps: AdminApplication[]) {
  const text = messageText(m);
  const app = matchApplicant(apps, m.from);
  const isNew = await recordMessage({
    waId: m.from,
    direction: "in",
    referenceNumber: app?.reference ?? null,
    kind: m.type,
    body: text,
    profileName: profileName ?? null,
    metaMessageId: m.id,
    status: "received",
  });
  if (!isNew || !app || app.status !== "approved") return;

  const now = new Date();
  const changes: Parameters<typeof saveReview>[1] = {};
  if (!app.repliedAt) changes.repliedAt = now;

  if (isOptOut(text)) {
    changes.optedOutAt = now;
    await saveReview(app, changes);
    Object.assign(app, { repliedAt: app.repliedAt ?? now.toISOString(), optedOutAt: now.toISOString() });
    return;
  }

  const choice = app.choice ? null : detectChoice(m.button?.payload ?? text);
  if (choice) changes.choice = choice;
  await saveReview(app, changes);
  // Later messages in the same webhook batch see the updated state (no second auto-reply).
  Object.assign(app, { repliedAt: app.repliedAt ?? now.toISOString(), choice: choice ?? app.choice });

  if (choice) {
    const template = REPLY_TEMPLATES[choice];
    try {
      await sendApplicantTemplate(app, template);
    } catch (err) {
      logger.warn({ err, reference: app.reference }, "Automatic WhatsApp reply failed");
      // Shown in the inbox thread as "Not delivered" so whoever picks up the chat sees it.
      await recordMessage({
        waId: m.from,
        direction: "out",
        referenceNumber: app.reference,
        kind: "template",
        templateName: template.name,
        body: fillFirstName(template.text, firstNameOf(app.fullName)),
        status: "failed",
        error: `Automatic reply not sent: ${err instanceof WhatsAppError ? err.message : String(err)}`,
      });
    }
  }
}

async function handleStatus(s: WebhookStatus) {
  const e = s.errors?.[0];
  const error = e ? [e.title ?? e.message, e.error_data?.details].filter(Boolean).join(": ") : null;
  const [row] = await db
    .update(whatsappMessagesTable)
    .set({ status: s.status, ...(error ? { error } : {}), updatedAt: new Date() })
    .where(eq(whatsappMessagesTable.metaMessageId, s.id))
    .returning({ reference: whatsappMessagesTable.referenceNumber, templateName: whatsappMessagesTable.templateName });

  if (s.status === "failed" && row?.reference) {
    await db
      .update(applicationReviewsTable)
      .set({ sendError: `Not delivered${row.templateName ? ` (${row.templateName})` : ""}: ${error ?? "unknown reason"}`, sendErrorAt: new Date() })
      .where(eq(applicationReviewsTable.referenceNumber, row.reference));
  }
}

/** Processes one webhook POST body from Meta. */
export async function handleWebhookPayload(payload: unknown): Promise<void> {
  const entries = (payload as { entry?: { changes?: { field?: string; value?: WebhookValue }[] }[] })?.entry ?? [];
  const values = entries.flatMap((e) => e.changes ?? []).filter((c) => c.field === "messages").map((c) => c.value ?? {});
  if (values.length === 0) return;

  await ensureAdminTables();
  const hasMessages = values.some((v) => v.messages?.length);
  const apps = hasMessages ? await loadApplications() : [];

  for (const value of values) {
    const names = new Map((value.contacts ?? []).map((c) => [c.wa_id, c.profile?.name]));
    for (const m of value.messages ?? []) {
      try {
        await handleIncoming(m, names.get(m.from), apps);
      } catch (err) {
        logger.error({ err, messageId: m.id }, "Failed to process incoming WhatsApp message");
      }
    }
    for (const s of value.statuses ?? []) {
      try {
        await handleStatus(s);
      } catch (err) {
        logger.error({ err, messageId: s.id }, "Failed to process WhatsApp status update");
      }
    }
  }
}
