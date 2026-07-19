import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Tesla Pro <onboarding@resend.dev>";

export async function sendWelcomeEmail(opts: {
  email: string;
  firstName: string;
  memberCode: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject: "Welcome to Tesla Pro Platform",
      html: `
        <div style="font-family:Inter,sans-serif;background:#0a0f1a;color:#e8eaec;max-width:560px;margin:0 auto;padding:40px 32px;border-radius:12px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:22px;font-weight:700;letter-spacing:4px;color:#fff;">TESLA PRO</span>
          </div>
          <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 12px;">Welcome, ${opts.firstName}!</h1>
          <p style="color:#8a9bb0;line-height:1.6;margin:0 0 24px;">
            Your Tesla Pro membership account has been created. You now have access to exclusive investment plans, our Tesla showroom, and premium member benefits.
          </p>
          <div style="background:#111827;border:1px solid #1a2332;border-radius:8px;padding:20px;margin-bottom:28px;">
            <div style="font-size:12px;color:#8a9bb0;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Member Code</div>
            <div style="font-size:22px;font-weight:700;color:#e53e3e;letter-spacing:2px;">${opts.memberCode}</div>
          </div>
          <a href="https://teslafans.online/dashboard" style="display:inline-block;background:#e53e3e;color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Go to Dashboard →
          </a>
          <p style="color:#3a4552;font-size:12px;margin-top:40px;">Tesla Pro Platform · teslafans.online</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Welcome email failed:", err);
  }
}

export async function sendOrderConfirmationEmail(opts: {
  email: string;
  firstName: string;
  type: string;
  description: string;
  amount: number;
}) {
  const typeLabel: Record<string, string> = {
    deposit: "Deposit Request",
    withdrawal: "Withdrawal Request",
    investment: "Investment Application",
    purchase: "Car Purchase Order",
  };

  const label = typeLabel[opts.type] ?? "Order";

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject: `${label} Received — Tesla Pro`,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0a0f1a;color:#e8eaec;max-width:560px;margin:0 auto;padding:40px 32px;border-radius:12px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:22px;font-weight:700;letter-spacing:4px;color:#fff;">TESLA PRO</span>
          </div>
          <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 12px;">${label} Received</h1>
          <p style="color:#8a9bb0;line-height:1.6;margin:0 0 24px;">
            Hi ${opts.firstName}, we've received your ${label.toLowerCase()} and it is currently <strong style="color:#f6c90e;">pending review</strong>. You'll be notified once it's processed.
          </p>
          <div style="background:#111827;border:1px solid #1a2332;border-radius:8px;padding:20px;margin-bottom:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Type</td>
                <td style="color:#fff;font-size:13px;text-align:right;">${label}</td>
              </tr>
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Amount</td>
                <td style="color:#fff;font-size:13px;text-align:right;">$${opts.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Details</td>
                <td style="color:#fff;font-size:13px;text-align:right;">${opts.description}</td>
              </tr>
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Status</td>
                <td style="color:#f6c90e;font-size:13px;font-weight:600;text-align:right;">Pending</td>
              </tr>
            </table>
          </div>
          <a href="https://teslafans.online/transactions" style="display:inline-block;background:#e53e3e;color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            View Transactions →
          </a>
          <p style="color:#3a4552;font-size:12px;margin-top:40px;">Tesla Pro Platform · teslafans.online</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }
}

export async function sendOrderStatusEmail(opts: {
  email: string;
  firstName: string;
  type: string;
  description: string;
  amount: number;
  status: "approved" | "rejected";
}) {
  const typeLabel: Record<string, string> = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    investment: "Investment",
    purchase: "Car Purchase",
  };

  const label = typeLabel[opts.type] ?? "Order";
  const approved = opts.status === "approved";

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject: `${label} ${approved ? "Approved ✓" : "Rejected"} — Tesla Pro`,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0a0f1a;color:#e8eaec;max-width:560px;margin:0 auto;padding:40px 32px;border-radius:12px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:22px;font-weight:700;letter-spacing:4px;color:#fff;">TESLA PRO</span>
          </div>
          <h1 style="font-size:22px;font-weight:700;color:${approved ? "#38a169" : "#e53e3e"};margin:0 0 12px;">
            ${label} ${approved ? "Approved" : "Rejected"}
          </h1>
          <p style="color:#8a9bb0;line-height:1.6;margin:0 0 24px;">
            Hi ${opts.firstName}, your ${label.toLowerCase()} of <strong style="color:#fff;">$${opts.amount.toLocaleString()}</strong> has been 
            <strong style="color:${approved ? "#38a169" : "#e53e3e"};">${opts.status}</strong>${approved ? " and your account has been updated." : ". Please contact support if you have questions."}
          </p>
          <div style="background:#111827;border:1px solid #1a2332;border-radius:8px;padding:20px;margin-bottom:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Type</td>
                <td style="color:#fff;font-size:13px;text-align:right;">${label}</td>
              </tr>
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Amount</td>
                <td style="color:#fff;font-size:13px;text-align:right;">$${opts.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#8a9bb0;font-size:13px;padding:6px 0;">Status</td>
                <td style="color:${approved ? "#38a169" : "#e53e3e"};font-size:13px;font-weight:600;text-align:right;">${approved ? "Approved" : "Rejected"}</td>
              </tr>
            </table>
          </div>
          <a href="https://teslafans.online/dashboard" style="display:inline-block;background:#e53e3e;color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Go to Dashboard →
          </a>
          <p style="color:#3a4552;font-size:12px;margin-top:40px;">Tesla Pro Platform · teslafans.online</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Order status email failed:", err);
  }
}
