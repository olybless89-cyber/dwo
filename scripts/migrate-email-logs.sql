-- Run this once in your Supabase SQL editor (or via psql) to create the email_logs table.
-- This is the DB-side of the admin messaging feature.

CREATE TABLE IF NOT EXISTS email_logs (
  id                  TEXT PRIMARY KEY,
  recipient_type      TEXT NOT NULL,               -- 'single' | 'bulk'
  recipient_user_id   TEXT,                        -- NULL for bulk sends
  recipient_email     TEXT,                        -- NULL for bulk sends
  recipient_name      TEXT,                        -- NULL for bulk sends
  subject             TEXT NOT NULL,
  body                TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'sent', -- 'sent' | 'failed'
  error_message       TEXT,
  sent_count          INTEGER NOT NULL DEFAULT 1,  -- >1 for bulk
  sent_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for dashboard queries (newest first)
CREATE INDEX IF NOT EXISTS email_logs_sent_at_idx ON email_logs (sent_at DESC);
