#!/bin/bash
# TeslaPro Auto-Deploy Script
# Run this once to set up automatic deployment

set -e

echo "🚀 TeslaPro Auto-Deploy Setup"
echo "=============================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

echo ""
echo "📋 What you need:"
echo "   1. Railway account (railway.app)"
echo "   2. Supabase DATABASE_URL (from Supabase dashboard)"
echo "   3. Resend API key (from resend.com) - optional for emails"
echo ""

read -p "Do you have these ready? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please gather the required information first."
    echo "1. Sign up at https://railway.app"
    echo "2. Get DATABASE_URL from https://supabase.com/dashboard"
    exit 1
fi

echo ""
echo "🔐 Railway Authentication:"
echo "   1. Go to https://railway.app/account"
echo "   2. Click 'New Token'"
echo "   3. Copy the token"
echo ""

read -p "Paste Railway token (or press Enter to skip for now): " RAILWAY_TOKEN
read -p "Paste DATABASE_URL: " DATABASE_URL
read -p "Paste SESSION_SECRET (or press Enter for auto-generated): " SESSION_SECRET
read -p "Paste RESEND_API_KEY (or press Enter to skip): " RESEND_API_KEY

# Generate session secret if not provided
if [ -z "$SESSION_SECRET" ]; then
    SESSION_SECRET=$(openssl rand -base64 32)
    echo "✅ Generated session secret"
fi

echo ""
echo "🔧 Configuring GitHub Secrets..."

# Update GitHub repo with secrets
if [ -n "$RAILWAY_TOKEN" ]; then
    gh secret set RAILWAY_TOKEN --body "$RAILWAY_TOKEN" 2>/dev/null || echo "⚠️ Could not set RAILWAY_TOKEN (install gh cli: https://cli.github.com)"
fi
gh secret set DATABASE_URL --body "$DATABASE_URL" 2>/dev/null || echo "⚠️ Could not set DATABASE_URL"
gh secret set SESSION_SECRET --body "$SESSION_SECRET" 2>/dev/null || echo "⚠️ Could not set SESSION_SECRET"

if [ -n "$RESEND_API_KEY" ]; then
    gh secret set RESEND_API_KEY --body "$RESEND_API_KEY" 2>/dev/null || echo "⚠️ Could not set RESEND_API_KEY"
fi

echo ""
echo "🚀 Triggering deployment..."

# Trigger the workflow
gh workflow run deploy.yml --ref fix-admin-migration 2>/dev/null || echo "⚠️ Could not trigger workflow. Go to GitHub Actions and run manually."

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Check GitHub Actions for deployment status"
echo "2. Once deployed, update Vercel with API URL:"
echo "   - Go to Vercel Dashboard"
echo "   - Your project → Settings → Environment Variables"
echo "   - Add: VITE_API_BASE_URL = https://your-api.railway.app"
echo "   - Redeploy"
echo ""
echo "💡 Admin credentials:"
echo "   Email: admin@teslafans.online"
echo "   Password: TeslaPro2025!"
