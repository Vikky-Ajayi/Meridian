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
  reasons: jsonb("reasons").notNull().$type<string[]>(),
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
