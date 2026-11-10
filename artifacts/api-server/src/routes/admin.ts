import { Router, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, whatsappMessagesTable } from "@workspace/db";
import { ensureAdminTables } from "../lib/adminTables";
import { findApplication, loadApplications, saveReview, sequenceOver, type AdminApplication } from "../lib/applications";
import { logger } from "../lib/logger";
import { whatsappDigits } from "../lib/phone";
import { cloudApiConfigured, sendTemplate, sendText, WhatsAppError } from "../lib/whatsappCloud";
import { dueStep, recordMessage, sendApplicantTemplate, sendFollowUp } from "../lib/whatsappMessaging";
import { fillFirstName, firstNameOf, RESTART_TEMPLATE, SEQUENCE_TEMPLATES, TEMPLATE_LANGUAGE } from "../lib/whatsappTemplates";

// Admin review dashboard API (/api/admin). Deliberately unauthenticated, at the
// owner's request: anyone with the dashboard URL can read applicants and
// message them.
//
// Two WhatsApp modes:
//  • automatic – WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are set: approving
//    sends Message 1 through the WhatsApp Cloud API and follow-ups are sent by the
//    scheduler (lib/whatsappMessaging.ts); replies arrive through the webhook.
//  • manual – the dashboard opens WhatsApp with each message pre-filled and the
//    admin records what was sent.

const router = Router();

router.use((_req, res, next) => {
  res.set("X-Robots-Tag", "noindex, nofollow");
  res.set("Cache-Control", "no-store");
  next();
});

function sendError(res: Response, status: number, error: string) {
  return res.status(status).json({ error });
}

const whatsappMode = () => (cloudApiConfigured() ? "automatic" : "manual");

async function respondWith(res: Response, reference: string) {
  return res.json({ application: await findApplication(reference) });
}

// GET /api/admin/applications
router.get("/applications", async (_req, res) => {
  try {
    return res.json({
      applications: await loadApplications(),
      whatsapp: {
        mode: whatsappMode(),
        repliesConnected: Boolean(process.env.WHATSAPP_APP_SECRET && process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN),
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to load admin applications");
    return sendError(res, 500, "Could not load applications. Check the server logs and database connection.");
  }
});

// POST /api/admin/applications/:reference/approve
// Automatic mode sends Message 1 now; manual mode records it as sent (the
// dashboard opens WhatsApp with it pre-filled at the same moment).
router.post("/applications/:reference/approve", async (req, res) => {
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status === "approved") return sendError(res, 409, "This applicant is already approved.");
  if (app.status === "rejected") return sendError(res, 409, "Move this applicant back to review before approving.");

  if (cloudApiConfigured()) {
    try {
      await sendApplicantTemplate(app, SEQUENCE_TEMPLATES[app.form][0]);
    } catch (err) {
      logger.warn({ err, reference: app.reference }, "Approval message failed");
      return sendError(res, 502, `Not approved, Message 1 wasn't sent: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const now = new Date();
  await saveReview(app, {
    status: "approved",
    approvedAt: now,
    messagesSent: 1,
    lastMessageAt: now,
    repliedAt: null,
    followUpsStoppedAt: null,
    optedOutAt: null,
    choice: null,
    sendError: null,
    sendErrorAt: null,
  });
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/send-due  (automatic mode)
// Sends the follow-up that's due now, e.g. to retry after a failure or outside sending hours.
router.post("/applications/:reference/send-due", async (req, res) => {
  if (!cloudApiConfigured()) return sendError(res, 409, "Automatic sending isn't connected.");
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  const index = dueStep(app, new Date());
  if (index === null || index === 0) return sendError(res, 409, "No follow-up is due for this applicant.");
  await sendFollowUp(app, index);
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/message-sent  { step: 2..5 }  (manual mode)
router.post("/applications/:reference/message-sent", async (req, res) => {
  if (cloudApiConfigured()) return sendError(res, 409, "Follow-ups are sent automatically now. Refresh the page.");
  const step = (req.body as { step?: unknown } | undefined)?.step;
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status !== "approved") return sendError(res, 409, "Approve this applicant first.");
  if (sequenceOver(app)) return sendError(res, 409, "This applicant's follow-ups have ended.");
  if (step !== app.messagesSent + 1) {
    return sendError(res, 409, `Message ${app.messagesSent + 1} is the next one to send. Refresh the page.`);
  }
  await saveReview(app, { messagesSent: step, lastMessageAt: new Date() });
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/undo-message  { step }  (manual mode)
// Undoes the most recent "sent" mark. Undoing Message 1 also undoes the approval.
router.post("/applications/:reference/undo-message", async (req, res) => {
  if (cloudApiConfigured()) return sendError(res, 409, "Messages sent automatically can't be undone.");
  const step = (req.body as { step?: unknown } | undefined)?.step;
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status !== "approved" || step !== app.messagesSent) {
    return sendError(res, 409, "Only the most recent message can be undone. Refresh the page.");
  }
  if (step === 1) {
    await saveReview(app, { status: "new", approvedAt: null, messagesSent: 0, lastMessageAt: null });
  } else {
    await saveReview(app, { messagesSent: step - 1 });
  }
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/replied  { replied: boolean }
router.post("/applications/:reference/replied", async (req, res) => {
  const replied = (req.body as { replied?: unknown } | undefined)?.replied;
  if (typeof replied !== "boolean") return sendError(res, 400, "replied must be true or false.");
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status !== "approved") return sendError(res, 409, "Only approved applicants can be marked as replied.");
  await saveReview(app, { repliedAt: replied ? new Date() : null });
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/follow-ups  { stopped: boolean }
router.post("/applications/:reference/follow-ups", async (req, res) => {
  const stopped = (req.body as { stopped?: unknown } | undefined)?.stopped;
  if (typeof stopped !== "boolean") return sendError(res, 400, "stopped must be true or false.");
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status !== "approved") return sendError(res, 409, "Only approved applicants have follow-ups.");
  if (!stopped && app.optedOutAt) return sendError(res, 409, "This applicant asked not to be contacted.");
  await saveReview(app, { followUpsStoppedAt: stopped ? new Date() : null });
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/status  { status: "new" | "hold" | "rejected" }
router.post("/applications/:reference/status", async (req, res) => {
  const status = (req.body as { status?: unknown } | undefined)?.status;
  if (status !== "new" && status !== "hold" && status !== "rejected") {
    return sendError(res, 400, 'status must be "new", "hold" or "rejected".');
  }
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status === "approved") {
    return sendError(res, 409, "This applicant is already approved. Use Stop follow-ups instead.");
  }
  await saveReview(app, { status });
  return respondWith(res, app.reference);
});

// PUT /api/admin/applications/:reference/note  { note: string }
router.put("/applications/:reference/note", async (req, res) => {
  const note = (req.body as { note?: unknown } | undefined)?.note;
  if (typeof note !== "string" || note.length > 5000) {
    return sendError(res, 400, "note must be text of at most 5,000 characters.");
  }
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  await saveReview(app, { note });
  return respondWith(res, app.reference);
});

// ── Inbox (automatic mode) ─────────────────────────────────────────────────

const REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

function applicantByWaId(apps: AdminApplication[]) {
  const map = new Map<string, AdminApplication>();
  for (const app of apps) {
    const key = whatsappDigits(app.whatsappNumber);
    const current = map.get(key);
    if (!current || (app.status === "approved" && current.status !== "approved")) map.set(key, app);
  }
  return map;
}

function contactSummary(waId: string, messages: (typeof whatsappMessagesTable.$inferSelect)[], app: AdminApplication | undefined) {
  const last = messages[messages.length - 1];
  const lastIn = [...messages].reverse().find((m) => m.direction === "in");
  // Awaiting a reply if nothing has actually gone out since their last message.
  const answered = Boolean(lastIn && messages.some((m) => m.direction === "out" && m.status !== "failed" && m.createdAt >= lastIn.createdAt));
  const profileName = [...messages].reverse().find((m) => m.profileName)?.profileName ?? null;
  return {
    waId,
    name: app?.fullName ?? profileName ?? `+${waId}`,
    profileName,
    reference: app?.reference ?? null,
    form: app?.form ?? null,
    lastMessage: last ? { body: last.body, direction: last.direction, at: last.createdAt.toISOString(), status: last.status } : null,
    lastInboundAt: lastIn?.createdAt.toISOString() ?? null,
    canReply: Boolean(lastIn && Date.now() - lastIn.createdAt.getTime() < REPLY_WINDOW_MS),
    awaitingReply: Boolean(lastIn) && !answered,
  };
}

const validWaId = (s: string) => /^\d{6,15}$/.test(s);

// GET /api/admin/conversations
router.get("/conversations", async (_req, res) => {
  try {
    await ensureAdminTables();
    const [messages, apps] = await Promise.all([
      db.select().from(whatsappMessagesTable).orderBy(asc(whatsappMessagesTable.createdAt)),
      loadApplications(),
    ]);
    const byWaId = new Map<string, typeof messages>();
    for (const m of messages) byWaId.set(m.waId, [...(byWaId.get(m.waId) ?? []), m]);
    const applicants = applicantByWaId(apps);
    const conversations = [...byWaId.entries()]
      .map(([waId, list]) => contactSummary(waId, list, applicants.get(waId)))
      .sort((a, b) => (b.lastMessage?.at ?? "").localeCompare(a.lastMessage?.at ?? ""));
    return res.json({ conversations });
  } catch (err) {
    logger.error({ err }, "Failed to load WhatsApp conversations");
    return sendError(res, 500, "Could not load conversations.");
  }
});

async function loadThread(waId: string) {
  await ensureAdminTables();
  const [messages, apps] = await Promise.all([
    db.select().from(whatsappMessagesTable).where(eq(whatsappMessagesTable.waId, waId)).orderBy(asc(whatsappMessagesTable.createdAt)),
    loadApplications(),
  ]);
  return {
    conversation: contactSummary(waId, messages, applicantByWaId(apps).get(waId)),
    messages: messages.map((m) => ({
      id: m.id,
      direction: m.direction,
      kind: m.kind,
      templateName: m.templateName,
      body: m.body,
      status: m.status,
      error: m.error,
      at: m.createdAt.toISOString(),
    })),
  };
}

// GET /api/admin/conversations/:waId
router.get("/conversations/:waId", async (req, res) => {
  if (!validWaId(req.params.waId)) return sendError(res, 400, "Invalid WhatsApp number.");
  return res.json(await loadThread(req.params.waId));
});

// POST /api/admin/conversations/:waId/messages  { text }
router.post("/conversations/:waId/messages", async (req, res) => {
  const { waId } = req.params;
  const text = (req.body as { text?: unknown } | undefined)?.text;
  if (!validWaId(waId)) return sendError(res, 400, "Invalid WhatsApp number.");
  if (typeof text !== "string" || !text.trim() || text.length > 4096) {
    return sendError(res, 400, "Write a message of up to 4,096 characters.");
  }
  if (!cloudApiConfigured()) return sendError(res, 409, "WhatsApp Cloud API isn't connected.");
  const thread = await loadThread(waId);
  try {
    const metaMessageId = await sendText(waId, text.trim());
    await recordMessage({ waId, direction: "out", referenceNumber: thread.conversation.reference, kind: "text", body: text.trim(), metaMessageId, status: "sent" });
  } catch (err) {
    return sendError(res, 502, err instanceof WhatsAppError ? err.message : "Could not send the message.");
  }
  return res.json(await loadThread(waId));
});

// POST /api/admin/conversations/:waId/restart  – template message after the 24-hour window
router.post("/conversations/:waId/restart", async (req, res) => {
  const { waId } = req.params;
  if (!validWaId(waId)) return sendError(res, 400, "Invalid WhatsApp number.");
  if (!cloudApiConfigured()) return sendError(res, 409, "WhatsApp Cloud API isn't connected.");
  const thread = await loadThread(waId);
  const name = firstNameOf(thread.conversation.reference ? thread.conversation.name : thread.conversation.profileName ?? "");
  try {
    const metaMessageId = await sendTemplate(waId, RESTART_TEMPLATE.name, TEMPLATE_LANGUAGE, name);
    await recordMessage({
      waId,
      direction: "out",
      referenceNumber: thread.conversation.reference,
      kind: "template",
      templateName: RESTART_TEMPLATE.name,
      body: fillFirstName(RESTART_TEMPLATE.text, name || "there"),
      metaMessageId,
      status: "sent",
    });
  } catch (err) {
    return sendError(res, 502, err instanceof WhatsAppError ? err.message : "Could not send the message.");
  }
  return res.json(await loadThread(waId));
});

export default router;
