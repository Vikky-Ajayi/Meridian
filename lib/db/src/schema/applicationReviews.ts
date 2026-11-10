import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

// Admin review state for Move Money Abroad and Private Banking submissions.
// Kept in its own table (keyed by reference number) so the submission tables,
// and the public forms that write to them, are untouched. A submission with no
// row here has not been reviewed yet.
//
// The API server also creates this table on first use (see ensureApplicationReviewsTable
// in artifacts/api-server/src/routes/admin.ts) so deployments work without a manual
// `drizzle-kit push`. Keep the two definitions identical.
export const applicationReviewsTable = pgTable("application_reviews", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  // "move-money" | "private-banking"
  formType: text("form_type").notNull(),
  // "new" | "approved" | "hold" | "rejected"
  status: text("status").notNull().default("new"),
  note: text("note").notNull().default(""),
  approvedAt: timestamp("approved_at"),
  // WhatsApp sequence (sent by hand from the admin dashboard): how many of the
  // five messages have been sent, and when the applicant replied.
  messagesSent: integer("messages_sent").notNull().default(0),
  lastMessageAt: timestamp("last_message_at"),
  repliedAt: timestamp("replied_at"),
  followUpsStoppedAt: timestamp("follow_ups_stopped_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApplicationReview = typeof applicationReviewsTable.$inferSelect;
