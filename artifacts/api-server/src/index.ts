import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Run schema migrations on startup (idempotent)
async function runMigrations() {
  try {
    // Add columns if missing (will error silently if exists)
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;`).catch(() => {});
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;`).catch(() => {});

    // Try to change role column to text type to avoid enum issues
    try {
      await pool.query(`ALTER TABLE users ALTER COLUMN role TYPE text;`);
      logger.info("Changed role column to text type");
    } catch (e) {
      // Column is already text or we don't have permissions - that's ok
    }

    // Get existing role values in database to use the right one
    let adminRole = 'admin';
    try {
      const result = await pool.query(`SELECT DISTINCT role FROM users LIMIT 5;`);
      const roles = result.rows.map(r => r.role);
      logger.info({ roles }, "Existing roles in database");
      if (roles.includes('admin')) {
        adminRole = 'admin';
      } else {
        adminRole = roles[0] || 'admin';
      }
    } catch (e) {
      logger.warn({ e }, "Could not query existing roles");
    }

    // Ensure the platform owner always has admin role
    await pool.query(`
      UPDATE users SET role = $1, status = 'active'
      WHERE email = 'olybless89@gmail.com';
    `, [adminRole]).catch(e => logger.warn({ e }, "Could not update olybless89 role"));

    // Upsert the handover admin account — always syncs password & role so
    // the known credentials stay valid across redeploys until changed.
    const passwordHash = await bcrypt.hash("TeslaPro2025!", 12);
    const id = crypto.randomUUID();
    
    await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, status,
        balance, reward_points, referral_count, member_code, must_change_password, created_at, updated_at)
       VALUES ($1,'admin@teslafans.online',$2,'Admin','Tesla',$3,'active',0,0,0,'TP-ADMIN-0001',true,NOW(),NOW())
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             role = $3,
             status = 'active',
             must_change_password = true`,
      [id, passwordHash, adminRole]
    );
    logger.info({ adminRole }, "Admin account upserted");

    logger.info("Migrations OK");
  } catch (err) {
    // Log error but DON'T crash - let the server start anyway
    logger.error({ err }, "Migration failed — continuing anyway");
  }
}

runMigrations().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});
