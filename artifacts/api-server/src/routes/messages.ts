import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db, usersTable, emailLogsTable } from "@workspace/db";
import { JWT_SECRET } from "./auth";
import { sendAdminEmail, sendAdminBulkEmail } from "../lib/email";

const router: IRouter = Router();

// ── Auth guard: admin only ────────────────────────────────────────────────────
async function requireAdmin(req: any, res: any): Promise<string | null> {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }
  let payload: { sub: string };
  try {
    payload = jwt.verify(auth.slice(7), JWT_SECRET) as { sub: string };
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return null;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.sub));
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return null;
  }
  return user.id;
}

// ── GET /messages — list email logs (newest first) ───────────────────────────
router.get("/messages", async (req, res): Promise<void> => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const logs = await db
    .select()
    .from(emailLogsTable)
    .orderBy(desc(emailLogsTable.sentAt))
    .limit(200);

  res.json(logs);
});

// ── POST /messages/send — send to a single user ───────────────────────────────
router.post("/messages/send", async (req, res): Promise<void> => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const { userId, subject, body } = req.body ?? {};

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ message: "userId is required" });
    return;
  }
  if (!subject || typeof subject !== "string" || !subject.trim()) {
    res.status(400).json({ message: "subject is required" });
    return;
  }
  if (!body || typeof body !== "string" || !body.trim()) {
    res.status(400).json({ message: "body is required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const result = await sendAdminEmail({ to: user.email, subject, body });

  const [log] = await db
    .insert(emailLogsTable)
    .values({
      id: crypto.randomUUID(),
      recipientType: "single",
      recipientUserId: user.id,
      recipientEmail: user.email,
      recipientName: `${user.firstName} ${user.lastName}`,
      subject,
      body,
      status: result.ok ? "sent" : "failed",
      errorMessage: result.error ?? null,
      sentCount: 1,
    })
    .returning();

  if (!result.ok) {
    res.status(502).json({ message: `Email failed: ${result.error}`, log });
    return;
  }

  req.log.info({ userId: user.id, subject }, "Admin email sent to single user");
  res.status(201).json({ message: "Email sent", log });
});

// ── POST /messages/send-bulk — send to ALL users ─────────────────────────────
router.post("/messages/send-bulk", async (req, res): Promise<void> => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const { subject, body } = req.body ?? {};

  if (!subject || typeof subject !== "string" || !subject.trim()) {
    res.status(400).json({ message: "subject is required" });
    return;
  }
  if (!body || typeof body !== "string" || !body.trim()) {
    res.status(400).json({ message: "body is required" });
    return;
  }

  // Fetch all user emails
  const users = await db.select({ email: usersTable.email }).from(usersTable);
  if (users.length === 0) {
    res.status(400).json({ message: "No users found to send emails to" });
    return;
  }

  const result = await sendAdminBulkEmail({ recipients: users, subject, body });

  const status = result.failed === 0 ? "sent" : result.sent === 0 ? "failed" : "sent";
  const [log] = await db
    .insert(emailLogsTable)
    .values({
      id: crypto.randomUUID(),
      recipientType: "bulk",
      recipientUserId: null,
      recipientEmail: null,
      recipientName: null,
      subject,
      body,
      status,
      errorMessage: result.error ?? (result.failed > 0 ? `${result.failed} of ${users.length} failed` : null),
      sentCount: result.sent,
    })
    .returning();

  req.log.info({ subject, sent: result.sent, failed: result.failed }, "Admin bulk email sent");
  res.status(201).json({
    message: `Sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ""}`,
    log,
  });
});

export default router;
