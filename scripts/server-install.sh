#!/usr/bin/env bash
# Install + build on the cPanel server.
#
# Run from the app root (~/vouch) after `git pull`, with the app's Node
# virtual environment already active. cPanel's "Setup Node.js App" screen
# shows the exact activation command for your app, something like:
#
#   source /home/YOURUSER/nodevenv/APPNAME/20/bin/activate && cd /home/YOURUSER/APPNAME
#
# No native engine binaries to worry about anymore (that was Prisma-specific —
# see README for why the app moved to Kysely+mysql2, a pure-JS driver). This
# is now a completely standard install.

set -euo pipefail

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found — activate your Node.js App's virtual environment first (see the comment at the top of this script), then re-run." >&2
  exit 1
fi
echo "==> Using node $(node -v)"
echo "==> Using npm  $(npm -v)"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

echo "==> npm install --include=dev"
# --include=dev: cPanel's "Production" Application mode sets NODE_ENV=production,
# which makes plain `npm install` skip devDependencies — including typescript,
# needed just to build. Runtime doesn't need it; dist/ is all Passenger runs.
npm install --include=dev

echo "==> Building"
npm run build

cat <<'EOF'

Done. Still needed before this actually serves traffic:
  1. Set DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET (and BASE_PATH if
     deployed under a sub-path) — via cPanel's Node.js App > Environment
     Variables, or a .env file in the app root.
  2. First deploy only: apply db/schema.sql to the database once (e.g. via
     phpMyAdmin's SQL tab) — creates all the tables.
  3. Confirm the Application startup file is dist/index.js, then Restart from
     cPanel's "Setup Node.js App" screen.
EOF
