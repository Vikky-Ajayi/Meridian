import { pool } from "@workspace/db";

// Creates the admin dashboard's tables (and any columns added since) on first
// use, so a deploy doesn't depend on someone running `drizzle-kit push`.
// Mirrors lib/db/src/schema/applicationReviews.ts and whatsappMessages.ts.
const SQL = `
CREATE TABLE IF NOT EXISTS application_reviews (
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
ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS replied_at timestamp;
ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS opted_out_at timestamp;
ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS choice text;
ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS send_error text;
ALTER TABLE application_reviews ADD COLUMN IF NOT EXISTS send_error_at timestamp;

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id serial PRIMARY KEY,
  wa_id text NOT NULL,
  direction text NOT NULL,
  reference_number text,
  kind text DEFAULT 'text' NOT NULL,
  template_name text,
  body text DEFAULT '' NOT NULL,
  profile_name text,
  meta_message_id text,
  status text DEFAULT 'sent' NOT NULL,
  error text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  CONSTRAINT whatsapp_messages_meta_message_id_unique UNIQUE (meta_message_id)
);
CREATE INDEX IF NOT EXISTS whatsapp_messages_wa_id_idx ON whatsapp_messages (wa_id);
`;

let ready: Promise<void> | null = null;

export function ensureAdminTables(): Promise<void> {
  ready ??= pool
    .query(SQL)
    .then(() => undefined)
    .catch((err) => {
      ready = null;
      throw err;
    });
  return ready;
}
