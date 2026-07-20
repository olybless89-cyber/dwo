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

    // Seed the handover admin account if it doesn't exist yet
    const existing = await pool.query(
      `SELECT id FROM users WHERE email = 'admin@teslafans.online' LIMIT 1`
    );
    if (existing.rows.length === 0) {
      const passwordHash = await bcrypt.hash("TeslaPro2025!", 12);
      const id = crypto.randomUUID();
      const memberCode = "TP-ADMIN-0001";
      await pool.query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, role, status,
          balance, reward_points, referral_count, member_code, must_change_password, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,'admin','active',0,0,0,$6,true,NOW(),NOW())`,
        [id, "admin@teslafans.online", passwordHash, "Admin", "Tesla", memberCode]
      );
      logger.info("Seeded handover admin account");
    }

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
