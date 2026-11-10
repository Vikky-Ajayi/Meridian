import { Router, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  pool,
  moveMoneySbmissionsTable,
  privateBankingSubmissionsTable,
  applicationReviewsTable,
  type MoveMoney,
  type PrivateBanking,
  type ApplicationReview,
} from "@workspace/db";
import { logger } from "../lib/logger";

// Admin review dashboard API (/api/admin). Deliberately unauthenticated, at the
// owner's request: anyone with the dashboard URL can read applicants.
//
// WhatsApp messages are sent by hand from the dashboard (it opens WhatsApp with
// the message pre-filled); this API only records the review decision and which
// of the five sequence messages have been sent.

const router = Router();

router.use((_req, res, next) => {
  res.set("X-Robots-Tag", "noindex, nofollow");
  res.set("Cache-Control", "no-store");
  next();
});

const STATUSES = ["new", "approved", "hold", "rejected"] as const;
type Status = (typeof STATUSES)[number];
type FormType = "move-money" | "private-banking";
const SEQUENCE_LENGTH = 5;

// Mirrors lib/db/src/schema/applicationReviews.ts; creates the table (and any
// columns added since) on first use so a deploy doesn't depend on someone
// running `drizzle-kit push`.
let reviewsTableReady: Promise<void> | null = null;
function ensureApplicationReviewsTable() {
  reviewsTableReady ??= pool
    .query(
      `CREATE TABLE IF NOT EXISTS application_reviews (
        id serial PRIMARY KEY,
        reference_number text NOT NULL,
        form_type text NOT NULL,
        status text DEFAULT 'new' NOT NULL,
        note text DEFAULT '' NOT NULL,
        approved_at timestamp,
        messages_sent integer DEFAULT 0 NOT NULL,
        last_message_at timestamp,
        replied_at timestamp,
        follow_ups_stopped_at timestamp,
        updated_at timestamp DEFAULT now() NOT NULL,
        CONSTRAINT application_reviews_reference_number_unique UNIQUE (reference_number)
      );
      ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS messages_sent integer DEFAULT 0 NOT NULL;
      ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS last_message_at timestamp;
      ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS replied_at timestamp;`,
    )
    .then(() => undefined)
    .catch((err) => {
      reviewsTableReady = null;
      throw err;
    });
  return reviewsTableReady;
}

interface Answer {
  key: string;
  question: string;
  answer: string;
}

interface AdminApplication {
  reference: string;
  form: FormType;
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  submittedAt: string;
  status: Status;
  note: string;
  approvedAt: string | null;
  messagesSent: number;
  lastMessageAt: string | null;
  repliedAt: string | null;
  followUpsStoppedAt: string | null;
  answers: Answer[];
}

function moveMoneyAnswers(row: MoveMoney): Answer[] {
  return [
    { key: "amount", question: "Approximate amount to move", answer: row.amountRange },
    { key: "origin", question: "Where the funds are located", answer: row.fundsLocation },
    { key: "destination", question: "Where the funds are going", answer: row.destination },
    { key: "purpose", question: "Purpose of the transfer", answer: row.purpose },
    { key: "source", question: "Source of the funds", answer: row.sourceOfFunds },
    { key: "institution", question: "Funds held with a bank or regulated institution", answer: row.regulatedInstitution },
    { key: "availability", question: "Funds available for transfer", answer: row.fundsAvailability },
    { key: "authority", question: "Authority to arrange the transfer", answer: row.transferAuthority },
    { key: "timeline", question: "When they want to proceed", answer: row.timeline },
    { key: "assistance", question: "Assistance required", answer: row.assistanceRequired },
  ];
}

function privateBankingAnswers(row: PrivateBanking): Answer[] {
  return [
    { key: "banking", question: "Banking relationship sought", answer: row.bankingRelationshipType },
    { key: "wealth", question: "Approximate investable wealth", answer: row.investableWealth },
    { key: "jurisdictions", question: "Jurisdictions of interest", answer: (row.jurisdictions ?? []).join(", ") },
    { key: "purpose", question: "What they want to achieve", answer: row.purpose || (row.reasons ?? []).join(", ") },
    { key: "source", question: "Source of wealth or funds", answer: row.sourceOfWealth },
    { key: "capital", question: "Initial capital to place", answer: row.initialCapital },
    { key: "timeline", question: "How soon they want to start", answer: row.timeline },
    { key: "motivation", question: "What prompted the enquiry", answer: row.motivation },
  ];
}

const iso = (d: Date | null | undefined) => d?.toISOString() ?? null;

function toApplication(
  form: FormType,
  row: MoveMoney | PrivateBanking,
  answers: Answer[],
  review: ApplicationReview | undefined,
): AdminApplication {
  return {
    reference: row.referenceNumber,
    form,
    fullName: row.fullName,
    email: row.emailAddress,
    whatsappNumber: row.whatsappNumber,
    country: row.countryOfResidence,
    submittedAt: row.submittedAt.toISOString(),
    status: (STATUSES as readonly string[]).includes(review?.status ?? "") ? (review!.status as Status) : "new",
    note: review?.note ?? "",
    approvedAt: iso(review?.approvedAt),
    messagesSent: review?.messagesSent ?? 0,
    lastMessageAt: iso(review?.lastMessageAt),
    repliedAt: iso(review?.repliedAt),
    followUpsStoppedAt: iso(review?.followUpsStoppedAt),
    answers,
  };
}

async function loadApplications(): Promise<AdminApplication[]> {
  await ensureApplicationReviewsTable();
  const [moveRows, bankRows, reviews] = await Promise.all([
    db.select().from(moveMoneySbmissionsTable).orderBy(desc(moveMoneySbmissionsTable.submittedAt)),
    db.select().from(privateBankingSubmissionsTable).orderBy(desc(privateBankingSubmissionsTable.submittedAt)),
    db.select().from(applicationReviewsTable),
  ]);
  const reviewByRef = new Map(reviews.map((r) => [r.referenceNumber, r]));
  return [
    ...moveRows.map((row) => toApplication("move-money", row, moveMoneyAnswers(row), reviewByRef.get(row.referenceNumber))),
    ...bankRows.map((row) => toApplication("private-banking", row, privateBankingAnswers(row), reviewByRef.get(row.referenceNumber))),
  ].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

async function findApplication(reference: string): Promise<AdminApplication | null> {
  await ensureApplicationReviewsTable();
  const [review] = await db
    .select()
    .from(applicationReviewsTable)
    .where(eq(applicationReviewsTable.referenceNumber, reference));

  if (reference.startsWith("MMA-")) {
    const [row] = await db.select().from(moveMoneySbmissionsTable).where(eq(moveMoneySbmissionsTable.referenceNumber, reference));
    return row ? toApplication("move-money", row, moveMoneyAnswers(row), review) : null;
  }
  if (reference.startsWith("PBI-")) {
    const [row] = await db
      .select()
      .from(privateBankingSubmissionsTable)
      .where(eq(privateBankingSubmissionsTable.referenceNumber, reference));
    return row ? toApplication("private-banking", row, privateBankingAnswers(row), review) : null;
  }
  return null;
}

type ReviewChanges = Partial<
  Pick<ApplicationReview, "status" | "note" | "approvedAt" | "messagesSent" | "lastMessageAt" | "repliedAt" | "followUpsStoppedAt">
>;

async function saveReview(app: AdminApplication, changes: ReviewChanges) {
  await db
    .insert(applicationReviewsTable)
    .values({ referenceNumber: app.reference, formType: app.form, status: app.status, note: app.note, ...changes })
    .onConflictDoUpdate({
      target: applicationReviewsTable.referenceNumber,
      set: { ...changes, updatedAt: new Date() },
    });
}

function sendError(res: Response, status: number, error: string) {
  return res.status(status).json({ error });
}

const sequenceOver = (app: AdminApplication) =>
  Boolean(app.repliedAt || app.followUpsStoppedAt) || app.messagesSent >= SEQUENCE_LENGTH;

async function respondWith(res: Response, reference: string) {
  return res.json({ application: await findApplication(reference) });
}

// GET /api/admin/applications
router.get("/applications", async (_req, res) => {
  try {
    return res.json({ applications: await loadApplications() });
  } catch (err) {
    logger.error({ err }, "Failed to load admin applications");
    return sendError(res, 500, "Could not load applications. Check the server logs and database connection.");
  }
});

// POST /api/admin/applications/:reference/approve
// Approves the applicant and records Message 1 as sent (the dashboard opens
// WhatsApp with it pre-filled at the same moment).
router.post("/applications/:reference/approve", async (req, res) => {
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status === "approved") return sendError(res, 409, "This applicant is already approved.");
  if (app.status === "rejected") return sendError(res, 409, "Move this applicant back to review before approving.");
  const now = new Date();
  await saveReview(app, {
    status: "approved",
    approvedAt: now,
    messagesSent: 1,
    lastMessageAt: now,
    repliedAt: null,
    followUpsStoppedAt: null,
  });
  return respondWith(res, app.reference);
});

// POST /api/admin/applications/:reference/message-sent  { step: 2..5 }
router.post("/applications/:reference/message-sent", async (req, res) => {
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

// POST /api/admin/applications/:reference/undo-message  { step }
// Undoes the most recent "sent" mark. Undoing Message 1 also undoes the approval.
router.post("/applications/:reference/undo-message", async (req, res) => {
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

export default router;
