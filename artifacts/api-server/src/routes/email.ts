import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? "Tesla Pro <onboarding@resend.dev>";

// POST /admin/email/single
router.post("/admin/email/single", async (req, res): Promise<void> => {
  const { userId, toEmail, subject, body } = req.body as {
    userId?: string;
    toEmail?: string;
    subject: string;
    body: string;
  };
  if (!subject || !body) {
    res.status(400).json({ message: "subject and body are required" });
    return;
  }
  let recipient = toEmail;
  let firstName = "";
  if (userId) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ message: "User not found" }); return; }
    recipient = user.email;
    firstName = user.firstName;
  }
  if (!recipient) {
    res.status(400).json({ message: "userId or toEmail is required" });
    return;
  }
  const resend = getResend();
  const result = await resend.emails.send({
    from: FROM,
    to: recipient,
    subject,
    html: buildEmailHtml(subject, body, firstName),
  });
  res.json({ success: true, id: result.data?.id });
});

// POST /admin/email/bulk
router.post("/admin/email/bulk", async (req, res): Promise<void> => {
  const { subject, body } = req.body as { subject: string; body: string };
  if (!subject || !body) {
    res.status(400).json({ message: "subject and body are required" });
    return;
  }
  const users = await db.select().from(usersTable);
  if (users.length === 0) {
    res.status(400).json({ message: "No users found" });
    return;
  }
  const resend = getResend();
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < users.length; i += 10) {
    const batch = users.slice(i, i + 10);
    await Promise.allSettled(
      batch.map(async (u) => {
        try {
          await resend.emails.send({
            from: FROM,
            to: u.email,
            subject,
            html: buildEmailHtml(subject, body, u.firstName),
          });
          sent++;
        } catch {
          failed++;
        }
      })
    );
    if (i + 10 < users.length) await sleep(1000);
  }
  res.json({ success: true, sent, failed, total: users.length });
});

function buildEmailHtml(subject: string, body: string, firstName?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";
  const bodyHtml = body
    .split("\n")
    .map((line) => `<p style="color:#8a9bb0;line-height:1.7;margin:0 0 12px;">${line || "&nbsp;"}</p>`)
    .join("");
  return `
    <div style="font-family:Inter,sans-serif;background:#0a0f1a;color:#e8eaec;max-width:560px;margin:0 auto;padding:40px 32px;border-radius:12px;">
      <div style="text-align:center;margin-bottom:32px;">
        <span style="font-size:22px;font-weight:700;letter-spacing:4px;color:#fff;">TESLA PRO</span>
      </div>
      <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0 0 8px;">${subject}</h1>
      <p style="color:#8a9bb0;margin:0 0 20px;">${greeting}</p>
      ${bodyHtml}
      <hr style="border:none;border-top:1px solid #1a2332;margin:32px 0;" />
      <p style="color:#3a4552;font-size:12px;margin:0;">Tesla Pro Platform · stockinvestmentrading.com</p>
    </div>
  `;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default router;
