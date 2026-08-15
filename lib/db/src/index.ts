import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // Log clearly but do NOT throw — let the server start so healthcheck passes
  // The server will return 503 on DB-dependent routes until DATABASE_URL is set
  console.error(
    "[db] WARNING: DATABASE_URL is not set. Database operations will fail. " +
    "Set DATABASE_URL in your Railway environment variables."
  );
}

/**
 * Supabase's direct connection host (db.REF.supabase.co) resolves only to
 * IPv6, which Render's free tier cannot reach (ENETUNREACH).
 * Rewrite the URL to use Supabase's IPv4-capable Session-mode pooler.
 *
 * Direct:  postgres://postgres:PASS@db.REF.supabase.co:5432/postgres
 * Pooler:  postgres://postgres.REF:PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres
 */
function resolveConnectionString(url: string): string {
  // Match the Supabase direct host pattern
  const match = url.match(
    /^(postgres(?:ql)?:\/\/)([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(:\d+\/.*)?$/,
  );
  if (!match) return url; // Already a pooler URL or non-Supabase — leave unchanged

  const [, scheme, user, pass, ref, rest] = match;
  const poolerHost = "aws-0-eu-west-1.pooler.supabase.com";
  const port = rest ?? ":5432/postgres";
  const rewritten = `${scheme}${user}.${ref}:${pass}@${poolerHost}${port}`;
  console.log("[db] Rewrote Supabase direct URL → Session pooler (IPv4)");
  return rewritten;
}

// Use a placeholder if DATABASE_URL is missing so the module loads without crashing
const connectionString = process.env.DATABASE_URL
  ? resolveConnectionString(process.env.DATABASE_URL)
  : "postgres://placeholder:placeholder@localhost:5432/placeholder";

export const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
