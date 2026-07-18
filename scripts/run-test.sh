#!/usr/bin/env bash
# Run the complete Barristrly web app for local testing.
# Usage:
#   ./scripts/run-test.sh           # install + env check + npm run dev
#   ./scripts/run-test.sh --build   # production build + start (closer to deploy)
#   ./scripts/run-test.sh --smoke   # start briefly, hit /api/v1/health, then exit
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MODE="dev"
SMOKE=0
PORT="${PORT:-3000}"

for arg in "$@"; do
  case "$arg" in
    --build) MODE="prod" ;;
    --smoke) SMOKE=1 ;;
    --help|-h)
      echo "Usage: $0 [--build] [--smoke]"
      echo "  (default)  npm install + env check + next dev"
      echo "  --build    production build + next start"
      echo "  --smoke    start server, curl health, stop"
      exit 0
      ;;
  esac
done

echo "==> Barristrly test runner (cwd: $ROOT)"

if ! command -v node >/dev/null; then
  echo "ERROR: Node.js not found. Install Node >= 20."
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "ERROR: Node >= 20 required (found $(node -v))."
  exit 1
fi

echo "==> Node $(node -v) / npm $(npm -v)"

# Prefer apps/web/.env.local (Next loads this when running the web workspace)
WEB_ENV="$ROOT/apps/web/.env.local"
ROOT_ENV="$ROOT/.env.local"
EXAMPLE="$ROOT/.env.example"

if [[ ! -f "$WEB_ENV" ]]; then
  if [[ -f "$ROOT_ENV" ]]; then
    echo "==> Copying root .env.local → apps/web/.env.local"
    cp "$ROOT_ENV" "$WEB_ENV"
  elif [[ -f "$EXAMPLE" ]]; then
    echo "==> Creating apps/web/.env.local from .env.example (fill in Supabase keys)"
    cp "$EXAMPLE" "$WEB_ENV"
  else
    echo "ERROR: No .env.local found. Copy .env.example to apps/web/.env.local"
    exit 1
  fi
fi

# shellcheck disable=SC1090
set -a
# Load for checks (Next also loads .env.local itself)
source "$WEB_ENV" 2>/dev/null || true
set +a

missing=0
require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "WARN: $name is empty — set it in apps/web/.env.local"
    missing=1
  fi
}

echo "==> Checking required env"
require_var NEXT_PUBLIC_SUPABASE_URL
require_var NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "WARN: SUPABASE_SERVICE_ROLE_KEY empty — admin console / analytics persist need it"
fi

if [[ "$missing" -eq 1 ]]; then
  echo "HINT: Get keys from Supabase → Project Settings → API"
  echo "      Then: open apps/web/.env.local and fill values (see .env.example)"
fi

echo "==> npm install (workspaces)"
npm install --silent

echo "==> Typecheck"
npm run typecheck

if [[ "$MODE" == "prod" || "$SMOKE" -eq 1 ]]; then
  echo "==> Production build"
  npm run build
fi

start_server() {
  # Bind localhost (avoids uv_interface_addresses issues in some environments)
  if [[ "$MODE" == "prod" || "$SMOKE" -eq 1 ]]; then
    npm run start -w @barristrly/web -- -H 127.0.0.1 -p "$PORT"
  else
    npm run dev -w @barristrly/web -- -H 127.0.0.1 -p "$PORT"
  fi
}

wait_health() {
  local url="http://127.0.0.1:${PORT}/api/v1/health"
  local i=0
  echo "==> Waiting for $url"
  until curl -sf --max-time 3 "$url" >/dev/null 2>&1; do
    i=$((i + 1))
    if [[ $i -gt 40 ]]; then
      echo "ERROR: Health check timed out"
      curl -sS --max-time 3 "$url" || true
      return 1
    fi
    sleep 1
  done
  echo "==> Health OK"
  curl -sS --max-time 3 "$url"
  echo
}

if [[ "$SMOKE" -eq 1 ]]; then
  echo "==> Smoke mode: start → health → stop"
  start_server &
  SERVER_PID=$!
  trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
  wait_health
  echo "==> Smoke passed"
  kill "$SERVER_PID" 2>/dev/null || true
  trap - EXIT
  exit 0
fi

echo ""
echo "============================================================"
echo "  App:      http://localhost:${PORT}"
echo "  Health:   http://localhost:${PORT}/api/v1/health"
echo "  Client:   http://localhost:${PORT}/client"
echo "  Lawyer:   http://localhost:${PORT}/lawyer"
echo "  Admin:    http://localhost:${PORT}/admin"
echo "  Login:    http://localhost:${PORT}/login"
echo ""
echo "  Tip: promote an admin with SQL:"
echo "    update public.users set role = 'platform_admin' where email = 'you@example.com';"
echo "============================================================"
echo ""

start_server
