import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const emailLogsTable = pgTable("email_logs", {
  id: text("id").primaryKey(),
  // "bulk" means sent to all users, otherwise the target user's id
  recipientType: text("recipient_type").notNull(), // "single" | "bulk"
  recipientUserId: text("recipient_user_id"),      // null for bulk
  recipientEmail: text("recipient_email"),          // null for bulk (logged per-send)
  recipientName: text("recipient_name"),            // null for bulk
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("sent"), // "sent" | "failed"
  errorMessage: text("error_message"),
  sentCount: integer("sent_count").notNull().default(1), // >1 for bulk
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailLog = typeof emailLogsTable.$inferSelect;
