#!/usr/bin/env bash
# Setup Telegram bot integration for VABeauty shop
# Run: bash scripts/setup-telegram.sh

set -e

BOT_TOKEN="8854897826:AAGiajjukIl5A2aKDxPCIrWGw6ZPX-0KIyQ"
CHAT_ID="410504002"
# Random secret to verify Telegram webhook calls
WEBHOOK_SECRET=$(openssl rand -hex 32)

echo "=== Deploying Edge Functions ==="
supabase functions deploy notify-telegram --no-verify-jwt
supabase functions deploy telegram-webhook --no-verify-jwt

echo ""
echo "=== Setting Supabase Secrets ==="
supabase secrets set TELEGRAM_BOT_TOKEN="$BOT_TOKEN"
supabase secrets set TELEGRAM_CHAT_ID="$CHAT_ID"
supabase secrets set TELEGRAM_WEBHOOK_SECRET="$WEBHOOK_SECRET"

echo ""
echo "=== Getting project URL ==="
PROJECT_URL=$(supabase status --output json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('API URL',''))" 2>/dev/null || echo "")

if [ -z "$PROJECT_URL" ]; then
  echo "Could not auto-detect project URL."
  echo "Please enter your Supabase project URL (e.g. https://xxxx.supabase.co):"
  read -r PROJECT_URL
fi

WEBHOOK_URL="${PROJECT_URL}/functions/v1/telegram-webhook"

echo ""
echo "=== Registering Telegram Webhook ==="
echo "Webhook URL: $WEBHOOK_URL"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\", \"secret_token\": \"${WEBHOOK_SECRET}\"}" | python3 -m json.tool

echo ""
echo "=== Running DB Migration ==="
supabase db push

echo ""
echo "=== Done! ==="
echo "WEBHOOK_SECRET (save this): $WEBHOOK_SECRET"
