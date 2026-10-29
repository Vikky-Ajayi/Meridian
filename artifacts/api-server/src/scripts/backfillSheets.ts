/**
 * One-off: copy enquiries that are already in the database into Google Sheets.
 *
 * Every submission is saved to Postgres before the (fire-and-forget) sheet sync,
 * so rows missed while the sheet credentials were broken can be recovered here.
 * Re-runnable: rows whose reference number is already in column A of the tab are skipped.
 *
 * Usage (from the repo root):
 *   pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/src/scripts/backfillSheets.ts --dry-run
 *   pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/src/scripts/backfillSheets.ts
 *
 * Reads ./.env from the repo root. Running outside Railway needs the *public*
 * Postgres URL: set DATABASE_PUBLIC_URL (it takes precedence over DATABASE_URL).
 * Column layouts mirror routes/enquiries.ts — keep the two in sync.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
try {
  process.loadEnvFile(path.join(repoRoot, ".env"));
} catch {
  // No .env file: rely on variables already in the environment.
}
if (process.env.DATABASE_PUBLIC_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_PUBLIC_URL;
}

const dryRun = process.argv.includes("--dry-run");

// Imported after the env is loaded: both modules read process.env at import time.
const { db, moveMoneySbmissionsTable, privateBankingSubmissionsTable, contactSubmissionsTable, introductionRequestsTable } =
  await import("@workspace/db");
const { appendToSheetStrict, readSheetStrict } = await import("../lib/googleSheets");

interface Job {
  sheet: string;
  rows: { referenceNumber: string; cells: string[] }[];
}

const iso = (d: Date) => d.toISOString();

const moveMoney = (await db.select().from(moveMoneySbmissionsTable)).map((r) => ({
  referenceNumber: r.referenceNumber,
  cells: [
    r.referenceNumber, iso(r.submittedAt), r.fullName, r.emailAddress, r.whatsappNumber,
    r.countryOfResidence, r.amountRange, r.fundsLocation, r.destination, r.purpose,
    r.timeline, r.regulatedInstitution,
  ],
}));

const privateBanking = (await db.select().from(privateBankingSubmissionsTable)).map((r) => ({
  referenceNumber: r.referenceNumber,
  cells: [
    r.referenceNumber, iso(r.submittedAt), r.fullName, r.emailAddress, r.whatsappNumber,
    r.countryOfResidence, r.bankingRelationshipType, r.investableWealth,
    r.jurisdictions.join(", "), r.reasons.join(", "), r.timeline,
  ],
}));

const contact = (await db.select().from(contactSubmissionsTable)).map((r) => ({
  referenceNumber: r.referenceNumber,
  cells: [
    r.referenceNumber, iso(r.submittedAt), r.fullName, r.emailAddress, r.phoneNumber,
    r.natureOfEnquiry, r.message,
  ],
}));

const introductions = (await db.select().from(introductionRequestsTable)).map((r) => ({
  referenceNumber: r.referenceNumber,
  cells: [r.referenceNumber, iso(r.submittedAt), r.fullName, r.emailAddress, r.region, r.message ?? ""],
}));

const jobs: Job[] = [
  { sheet: "Move Money Abroad", rows: moveMoney },
  { sheet: "Private Banking Introductions", rows: privateBanking },
  { sheet: "Contact Enquiries", rows: contact },
  { sheet: "Introduction Requests", rows: introductions },
];

for (const job of jobs) {
  const existing = new Set((await readSheetStrict(job.sheet)).map((row) => row[0]));
  const missing = job.rows.filter((r) => !existing.has(r.referenceNumber));
  console.log(`${job.sheet}: ${job.rows.length} in database, ${missing.length} missing from the sheet`);
  if (dryRun || missing.length === 0) continue;
  await appendToSheetStrict(job.sheet, missing.map((r) => r.cells));
  console.log(`  appended ${missing.length} rows`);
}

console.log(dryRun ? "Dry run only: nothing was written." : "Done.");
process.exit(0);
