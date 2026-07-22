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
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;`);

    // Ensure the platform owner always has admin role
    await pool.query(`
      UPDATE users SET role = 'admin'
      WHERE email = 'olybless89@gmail.com' AND role != 'admin';
    `);

    // Upsert the handover admin account — always syncs password & role so
    // the known credentials stay valid across redeploys until changed.
    const passwordHash = await bcrypt.hash("TeslaPro2025!", 12);
    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, status,
        balance, reward_points, referral_count, member_code, must_change_password, created_at, updated_at)
       VALUES ($1,'admin@teslafans.online',$2,'Admin','Tesla','admin','active',0,0,0,'TP-ADMIN-0001',true,NOW(),NOW())
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             role = 'admin',
             status = 'active',
             must_change_password = true`,
      [id, passwordHash]
    );
    logger.info("Admin account upserted");

    logger.info("Migrations OK");
  } catch (err) {
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
