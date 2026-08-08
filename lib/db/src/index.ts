import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Railway (and most managed Postgres providers) require SSL.
// We enable it when DATABASE_URL contains "railway" or when the
// DB_SSL env var is set to "true".  Local dev connections are left as-is.
const needsSsl =
  process.env.DB_SSL === "true" ||
  process.env.DATABASE_URL?.includes("railway") ||
  process.env.DATABASE_URL?.includes("neon") ||
  process.env.DATABASE_URL?.includes("supabase");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(needsSsl
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
