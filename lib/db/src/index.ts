import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
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
  const poolerHost = "aws-0-eu-central-1.pooler.supabase.com";
  const port = rest ?? ":5432/postgres";
  const rewritten = `${scheme}${user}.${ref}:${pass}@${poolerHost}${port}`;
  console.log("[db] Rewrote Supabase direct URL → Session pooler (IPv4)");
  return rewritten;
}

export const pool = new Pool({
  connectionString: resolveConnectionString(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
