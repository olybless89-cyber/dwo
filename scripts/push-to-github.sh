#!/usr/bin/env bash
# =============================================================================
#  push-to-github.sh
#  Run this on your Mac to commit all admin-messaging changes and push to GitHub.
#
#  Usage:
#    cd /path/to/your/local/dwo/clone
#    bash push-to-github.sh
# =============================================================================
set -e

echo "🔍  Checking git status..."
git status

echo ""
echo "📦  Staging all changed files..."
git add \
  lib/db/src/schema/emailLogs.ts \
  lib/db/src/schema/index.ts \
  artifacts/api-server/src/lib/email.ts \
  artifacts/api-server/src/routes/messages.ts \
  artifacts/api-server/src/routes/index.ts \
  artifacts/tesla-pro/src/pages/admin/Messages.tsx \
  artifacts/tesla-pro/src/components/AppLayout.tsx \
  artifacts/tesla-pro/src/App.tsx \
  artifacts/api-server/.env.example \
  scripts/migrate-email-logs.sql

echo ""
echo "✅  Files staged:"
git diff --cached --name-only

echo ""
echo "💾  Committing..."
git commit -m "feat: admin email messaging — single user + bulk send + history log

- lib/db: new email_logs table schema (emailLogs.ts)
- api-server: sendAdminEmail + sendAdminBulkEmail helpers in email.ts
- api-server: new /api/messages route (GET logs, POST send, POST send-bulk)
- frontend: /admin/messages page with Single / Bulk / History tabs
- frontend: Messages nav link added to admin sidebar (AppLayout.tsx)
- frontend: /admin/messages route registered in App.tsx
- scripts: migrate-email-logs.sql for manual DB migration"

echo ""
echo "🚀  Pushing to origin master..."
git push origin master

echo ""
echo "✅  Done! Changes pushed to GitHub."
echo ""
echo "⚠️  NEXT STEPS:"
echo "   1. Run scripts/migrate-email-logs.sql in your Supabase SQL editor"
echo "   2. Set RESEND_API_KEY in your Render/Railway backend environment"
echo "   3. Optionally set EMAIL_FROM to a verified Resend domain"
echo "   4. Trigger a redeploy on Netlify (frontend) and Render (backend)"
