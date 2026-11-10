import { pgTable, text, serial, timestamp, index } from "drizzle-orm/pg-core";

// Every WhatsApp message sent or received through the WhatsApp Cloud API, used
// for the admin dashboard inbox. Conversations are grouped by `waId` (the
// contact's number as digits with country code, e.g. "447886857463"), so
// messages from people who never filled in a form are kept too.
//
// Created on first use by the API server (artifacts/api-server/src/lib/adminTables.ts);
// keep the two definitions identical.
export const whatsappMessagesTable = pgTable(
  "whatsapp_messages",
  {
    id: serial("id").primaryKey(),
    waId: text("wa_id").notNull(),
    // "in" | "out"
    direction: text("direction").notNull(),
    referenceNumber: text("reference_number"),
    // "text" | "template" | "button" | other WhatsApp message types
    kind: text("kind").notNull().default("text"),
    templateName: text("template_name"),
    body: text("body").notNull().default(""),
    profileName: text("profile_name"),
    metaMessageId: text("meta_message_id").unique(),
    // "received" (inbound) | "sent" | "delivered" | "read" | "failed"
    status: text("status").notNull().default("sent"),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("whatsapp_messages_wa_id_idx").on(table.waId)],
);

export type WhatsappMessage = typeof whatsappMessagesTable.$inferSelect;
