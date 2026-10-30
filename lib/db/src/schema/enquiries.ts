import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moveMoneySbmissionsTable = pgTable("move_money_submissions", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  amountRange: text("amount_range").notNull(),
  fundsLocation: text("funds_location").notNull(),
  destination: text("destination").notNull(),
  purpose: text("purpose").notNull(),
  timeline: text("timeline").notNull(),
  regulatedInstitution: text("regulated_institution").notNull(),
  sourceOfFunds: text("source_of_funds").notNull().default(""),
  fundsAvailability: text("funds_availability").notNull().default(""),
  transferAuthority: text("transfer_authority").notNull().default(""),
  assistanceRequired: text("assistance_required").notNull().default(""),
  fullName: text("full_name").notNull(),
  countryOfResidence: text("country_of_residence").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  emailAddress: text("email_address").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertMoveMoneySchema = createInsertSchema(moveMoneySbmissionsTable).omit({ id: true, submittedAt: true });
export type InsertMoveMoney = z.infer<typeof insertMoveMoneySchema>;
export type MoveMoney = typeof moveMoneySbmissionsTable.$inferSelect;

export const privateBankingSubmissionsTable = pgTable("private_banking_submissions", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  bankingRelationshipType: text("banking_relationship_type").notNull(),
  investableWealth: text("investable_wealth").notNull(),
  jurisdictions: jsonb("jurisdictions").notNull().$type<string[]>(),
  // Legacy multi-select answer; superseded by the free-text `purpose`.
  reasons: jsonb("reasons").$type<string[]>(),
  purpose: text("purpose").notNull().default(""),
  sourceOfWealth: text("source_of_wealth").notNull().default(""),
  initialCapital: text("initial_capital").notNull().default(""),
  motivation: text("motivation").notNull().default(""),
  timeline: text("timeline").notNull(),
  fullName: text("full_name").notNull(),
  countryOfResidence: text("country_of_residence").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  emailAddress: text("email_address").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertPrivateBankingSchema = createInsertSchema(privateBankingSubmissionsTable).omit({ id: true, submittedAt: true });
export type InsertPrivateBanking = z.infer<typeof insertPrivateBankingSchema>;
export type PrivateBanking = typeof privateBankingSubmissionsTable.$inferSelect;

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  natureOfEnquiry: text("nature_of_enquiry").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactSubmissionsTable).omit({ id: true, submittedAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissionsTable.$inferSelect;

export const introductionRequestsTable = pgTable("introduction_requests", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  region: text("region").notNull(),
  message: text("message"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertIntroductionRequestSchema = createInsertSchema(introductionRequestsTable).omit({ id: true, submittedAt: true });
export type InsertIntroductionRequest = z.infer<typeof insertIntroductionRequestSchema>;
export type IntroductionRequest = typeof introductionRequestsTable.$inferSelect;
