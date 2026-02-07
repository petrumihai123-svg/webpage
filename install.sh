#!/usr/bin/env bash
set -euo pipefail

echo "== Ticket System installer =="
command -v docker >/dev/null 2>&1 || { echo "Docker is required."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required."; exit 1; }

ROOT_DIR="$(cd "")(dirname "${BASH_SOURCE[0]}") && pwd)"
cd "$ROOT_DIR"

# Start DB
echo "== Starting Postgres (docker compose) =="
docker compose up -d db

# Server deps
echo "== Installing server dependencies =="
cd "$ROOT_DIR/server"
npm install

echo "== Generating Prisma client =="
npx prisma generate

echo "== Running migrations =="
npx prisma migrate dev --name init --skip-seed

# Seed admin
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-ChangeMe123!}"

echo "== Seeding admin user =="
ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" node src/seedAdmin.js || true

echo ""
echo "✅ Setup complete."
echo "Admin login:"
echo "  email:    $ADMIN_EMAIL"
echo "  password: $ADMIN_PASSWORD"
echo ""
echo "== Starting API on http://localhost:4000 =="
npm run dev
