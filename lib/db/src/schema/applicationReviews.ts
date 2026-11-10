import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

// Admin review state for Move Money Abroad and Private Banking submissions.
// Kept in its own table (keyed by reference number) so the submission tables,
// and the public forms that write to them, are untouched. A submission with no
// row here has not been reviewed yet.
//
// The API server also creates this table on first use (see ensureAdminTables in
// artifacts/api-server/src/lib/adminTables.ts) so deployments work without a manual
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
  // Set when the applicant asks not to be contacted; no further messages are sent.
  optedOutAt: timestamp("opted_out_at"),
  // What the applicant chose in reply to Message 1: "whatsapp" | "call".
  choice: text("choice"),
  // Last automatic-send failure (WhatsApp Cloud API mode), shown in the dashboard.
  sendError: text("send_error"),
  sendErrorAt: timestamp("send_error_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApplicationReview = typeof applicationReviewsTable.$inferSelect;
