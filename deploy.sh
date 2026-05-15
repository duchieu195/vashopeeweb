#!/bin/bash
# deploy.sh — Build và deploy cả 2 SPA lên VPS
# Cách dùng: ./deploy.sh user@your-vps-ip

set -e

VPS="${1:-user@your-vps-ip}"
REMOTE_DIR="/var/www/vabeauty"

echo "==> Building frontend..."
cd vashopeeweb-app
npm run build
cd ..

echo "==> Building admin..."
cd vashopeeweb-admin
npm run build
cd ..

echo "==> Deploying to $VPS..."
ssh "$VPS" "mkdir -p $REMOTE_DIR/frontend $REMOTE_DIR/admin"

rsync -avz --delete vashopeeweb-app/dist/ "$VPS:$REMOTE_DIR/frontend/"
rsync -avz --delete vashopeeweb-admin/dist/ "$VPS:$REMOTE_DIR/admin/"

echo "==> Reloading Nginx..."
ssh "$VPS" "sudo nginx -t && sudo systemctl reload nginx"

echo "==> Deploy complete!"
