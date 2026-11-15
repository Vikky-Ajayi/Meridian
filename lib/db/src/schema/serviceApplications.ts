import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";

// Applications from the five service forms on the landing page (Large Capital
// Movement, Private Banking Introduction, High Value Real Estate, Trust &
// Offshore Company, Bespoke Services). Step 1 creates the row as a lead; step 2
// adds the detailed answers (or records that they asked for a call instead).
//
// The API server also creates this table on first use (see ensureAdminTables in
// artifacts/api-server/src/lib/adminTables.ts). Keep the two definitions identical.
export const serviceApplicationsTable = pgTable("service_applications", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  // Service slug, e.g. "large-capital-movement" (see serviceCatalog.ts)
  service: text("service").notNull(),
  // "lead" (step 1 only) | "applied" | "call_requested" | "below_minimum"
  stage: text("stage").notNull().default("lead"),
  // Secret returned after step 1; required to add the step 2 answers.
  token: text("token").notNull(),
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  countryOfResidence: text("country_of_residence").notNull().default(""),
  currency: text("currency").notNull().default(""),
  amount: text("amount").notNull().default(""),
  timeline: text("timeline").notNull().default(""),
  // Service-specific answers keyed by question key (step 1 extra + step 2).
  details: jsonb("details").notNull().default({}).$type<Record<string, string>>(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type ServiceApplication = typeof serviceApplicationsTable.$inferSelect;
