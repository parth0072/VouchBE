#!/usr/bin/env bash
# Install + build on the cPanel server, without ever running Prisma's
# postinstall (the step that's been crashing with SIGABRT / pthread_create
# resource errors on this account's shared/CloudLinux environment).
#
# Run from the app root (~/vouch) after `git pull`, with the app's Node
# virtual environment already active (cPanel's Setup Node.js App screen shows
# the activation command).
#
# What it does instead of a normal `npm install`:
#   1. npm install --ignore-scripts   — skips Prisma's postinstall entirely
#   2. copies deploy/prisma-client-rhel-openssl-3.0.x/ (built locally, off
#      this account, targeting this exact server: x86_64, OpenSSL 3.x) into
#      node_modules/.prisma/client — the piece --ignore-scripts left out
#   3. npm run build

set -euo pipefail

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found — the Node virtual environment isn't active in this" >&2
  echo "terminal session (it doesn't persist across sessions, only this shell)." >&2
  echo "Run this first, then re-run this script:" >&2
  echo "  source ~/nodevenv/vouch/20/bin/activate" >&2
  exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

PREBUILT="deploy/prisma-client-rhel-openssl-3.0.x"
if [ ! -f "$PREBUILT/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
  echo "Expected $PREBUILT/libquery_engine-rhel-openssl-3.0.x.so.node — did the repo pull correctly?" >&2
  exit 1
fi

echo "==> npm install --include=dev --ignore-scripts"
# --include=dev: cPanel's "Production" Application mode sets NODE_ENV=production,
# which makes plain `npm install` skip devDependencies — including typescript
# and the prisma CLI, both needed just to build. Runtime doesn't need them;
# `npm run build`'s output (dist/) is all Passenger actually runs.
npm install --include=dev --ignore-scripts

echo "==> Placing pre-built Prisma client (skips the crashing generate step)"
mkdir -p node_modules/.prisma/client
cp -R "$PREBUILT/." node_modules/.prisma/client/
chmod +x node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node

echo "==> Building"
npm run build

cat <<'EOF'

Done. Still needed before this actually serves traffic:
  1. Set DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET — via cPanel's
     Node.js App > Environment Variables, or a .env file in the app root.
  2. npx prisma migrate deploy      (creates the tables on the real DB — if
     this one crashes the same way, say so; it uses a different Prisma
     binary than the one this script worked around)
  3. Confirm the Application startup file is dist/index.js, then Restart
     from cPanel's "Setup Node.js App" screen.
EOF
