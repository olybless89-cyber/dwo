import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

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
    // Ensure the owner account always has admin role
    await pool.query(`
      UPDATE users SET role = 'admin'
      WHERE email = 'olybless89@gmail.com' AND role != 'admin';
    `);
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
