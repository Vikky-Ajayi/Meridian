import { desc, eq } from "drizzle-orm";
import {
  db,
  moveMoneySbmissionsTable,
  privateBankingSubmissionsTable,
  applicationReviewsTable,
  type MoveMoney,
  type PrivateBanking,
  type ApplicationReview,
} from "@workspace/db";
import { ensureAdminTables } from "./adminTables";
import type { FormType } from "./whatsappTemplates";

// Move Money Abroad and Private Banking submissions joined with their admin
// review state, as used by the admin dashboard, the WhatsApp webhook and the
// follow-up scheduler.

export const STATUSES = ["new", "approved", "hold", "rejected"] as const;
export type Status = (typeof STATUSES)[number];
export const SEQUENCE_LENGTH = 5;

export interface Answer {
  key: string;
  question: string;
  answer: string;
}

export interface AdminApplication {
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
  optedOutAt: string | null;
  choice: "whatsapp" | "call" | null;
  sendError: string | null;
  sendErrorAt: string | null;
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
    optedOutAt: iso(review?.optedOutAt),
    choice: review?.choice === "whatsapp" || review?.choice === "call" ? review.choice : null,
    sendError: review?.sendError ?? null,
    sendErrorAt: iso(review?.sendErrorAt),
    answers,
  };
}

export async function loadApplications(): Promise<AdminApplication[]> {
  await ensureAdminTables();
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

export async function findApplication(reference: string): Promise<AdminApplication | null> {
  await ensureAdminTables();
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

export type ReviewChanges = Partial<
  Pick<
    ApplicationReview,
    | "status"
    | "note"
    | "approvedAt"
    | "messagesSent"
    | "lastMessageAt"
    | "repliedAt"
    | "followUpsStoppedAt"
    | "optedOutAt"
    | "choice"
    | "sendError"
    | "sendErrorAt"
  >
>;

export async function saveReview(app: AdminApplication, changes: ReviewChanges) {
  await ensureAdminTables();
  await db
    .insert(applicationReviewsTable)
    .values({ referenceNumber: app.reference, formType: app.form, status: app.status, note: app.note, ...changes })
    .onConflictDoUpdate({
      target: applicationReviewsTable.referenceNumber,
      set: { ...changes, updatedAt: new Date() },
    });
}

/** No more sequence messages should go to this applicant. */
export const sequenceOver = (app: AdminApplication) =>
  Boolean(app.repliedAt || app.followUpsStoppedAt || app.optedOutAt) || app.messagesSent >= SEQUENCE_LENGTH;
