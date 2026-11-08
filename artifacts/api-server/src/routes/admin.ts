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
import {
  addApprovedApplicant,
  BrevoError,
  hasReplied,
  missingBrevoConfig,
  stopFollowUps,
  type FormType,
} from "../lib/brevo";
import { logger } from "../lib/logger";

// Admin review dashboard API (/api/admin). Deliberately unauthenticated, at the
// owner's request: anyone with the dashboard URL can read applicants and trigger
// WhatsApp sequences.

const router = Router();

router.use((_req, res, next) => {
  res.set("X-Robots-Tag", "noindex, nofollow");
  res.set("Cache-Control", "no-store");
  next();
});

const STATUSES = ["new", "approved", "hold", "rejected"] as const;
type Status = (typeof STATUSES)[number];

// Mirrors lib/db/src/schema/applicationReviews.ts; creates the table on first
// use so a deploy doesn't depend on someone running `drizzle-kit push`.
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
        follow_ups_stopped_at timestamp,
        updated_at timestamp DEFAULT now() NOT NULL,
        CONSTRAINT application_reviews_reference_number_unique UNIQUE (reference_number)
      )`,
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
    approvedAt: review?.approvedAt?.toISOString() ?? null,
    followUpsStoppedAt: review?.followUpsStoppedAt?.toISOString() ?? null,
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

type ReviewChanges = Partial<Pick<ApplicationReview, "status" | "note" | "approvedAt" | "followUpsStoppedAt">>;

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

// GET /api/admin/applications
router.get("/applications", async (_req, res) => {
  try {
    const applications = await loadApplications();
    const missing = missingBrevoConfig();
    return res.json({ applications, brevo: { connected: missing.length === 0, missing } });
  } catch (err) {
    logger.error({ err }, "Failed to load admin applications");
    return sendError(res, 500, "Could not load applications. Check the server logs and database connection.");
  }
});

// GET /api/admin/whatsapp-status
// Reply state for approved applicants whose follow-ups are still running,
// read from each Brevo contact's WA_REPLIED attribute. Cached briefly to stay
// well inside Brevo's rate limits.
const replyCache = new Map<string, { value: boolean | null; at: number }>();
const REPLY_CACHE_MS = 60_000;

router.get("/whatsapp-status", async (_req, res) => {
  if (missingBrevoConfig().length > 0) return res.json({ statuses: {} });
  try {
    const running = (await loadApplications()).filter((a) => a.status === "approved" && !a.followUpsStoppedAt);
    const statuses: Record<string, "replied" | "waiting" | "unknown"> = {};
    const queue = [...running];
    const worker = async () => {
      for (let app = queue.shift(); app; app = queue.shift()) {
        const cached = replyCache.get(app.email);
        let replied: boolean | null;
        if (cached && Date.now() - cached.at < REPLY_CACHE_MS) {
          replied = cached.value;
        } else {
          try {
            replied = await hasReplied(app.email);
            replyCache.set(app.email, { value: replied, at: Date.now() });
          } catch (err) {
            logger.warn({ err, reference: app.reference }, "Could not read WhatsApp reply state from Brevo");
            statuses[app.reference] = "unknown";
            continue;
          }
        }
        statuses[app.reference] = replied === null ? "unknown" : replied ? "replied" : "waiting";
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    return res.json({ statuses });
  } catch (err) {
    logger.error({ err }, "Failed to load WhatsApp reply states");
    return sendError(res, 500, "Could not load WhatsApp reply states.");
  }
});

// POST /api/admin/applications/:reference/approve
router.post("/applications/:reference/approve", async (req, res) => {
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status === "approved") return sendError(res, 409, "This applicant is already approved.");
  if (app.status === "rejected") return sendError(res, 409, "Move this applicant back to review before approving.");

  const missing = missingBrevoConfig();
  if (missing.length > 0) {
    return sendError(res, 503, `WhatsApp isn't connected yet. Add ${missing.join(", ")} to the API server's environment, then try again.`);
  }

  try {
    await addApprovedApplicant({
      form: app.form,
      referenceNumber: app.reference,
      fullName: app.fullName,
      email: app.email,
      whatsappNumber: app.whatsappNumber,
    });
  } catch (err) {
    logger.error({ err, reference: app.reference }, "Brevo rejected approved applicant");
    const message = err instanceof BrevoError ? err.message : "Could not reach Brevo.";
    return sendError(res, 502, `Not approved: ${message}`);
  }

  try {
    await saveReview(app, { status: "approved", approvedAt: new Date(), followUpsStoppedAt: null });
  } catch (err) {
    // Brevo already has the contact, so the sequence has started; say so plainly.
    logger.error({ err, reference: app.reference }, "Approved in Brevo but failed to save review state");
    return sendError(res, 500, "The WhatsApp sequence started, but the approval wasn't saved here. Refresh before doing anything else.");
  }
  replyCache.delete(app.email);
  return res.json({ application: await findApplication(app.reference) });
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
    return sendError(res, 409, "This applicant is already in the WhatsApp sequence. Use Stop follow-ups instead.");
  }
  await saveReview(app, { status });
  return res.json({ application: await findApplication(app.reference) });
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
  return res.json({ application: await findApplication(app.reference) });
});

// POST /api/admin/applications/:reference/stop-follow-ups
router.post("/applications/:reference/stop-follow-ups", async (req, res) => {
  const app = await findApplication(req.params.reference);
  if (!app) return sendError(res, 404, "Application not found.");
  if (app.status !== "approved") return sendError(res, 409, "Only approved applicants have follow-ups to stop.");
  if (app.followUpsStoppedAt) return res.json({ application: app });

  try {
    await stopFollowUps(app.email);
  } catch (err) {
    logger.error({ err, reference: app.reference }, "Failed to stop follow-ups in Brevo");
    const message = err instanceof BrevoError ? err.message : "Could not reach Brevo.";
    return sendError(res, 502, `Follow-ups not stopped: ${message}`);
  }
  await saveReview(app, { followUpsStoppedAt: new Date() });
  replyCache.delete(app.email);
  return res.json({ application: await findApplication(app.reference) });
});

export default router;
