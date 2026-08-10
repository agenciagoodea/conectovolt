#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/backend/.env.production.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: production env file not found: $ENV_FILE" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

required_vars=(DB_PROVIDER DATABASE_URL JWT_SECRET JWT_REFRESH_SECRET CORS_ORIGIN)
for variable in "${required_vars[@]}"; do
  if [ -z "${!variable:-}" ]; then
    echo "ERROR: missing required production variable: $variable" >&2
    exit 1
  fi
done

if [ "$DB_PROVIDER" != "mysql" ]; then
  echo "ERROR: production DB_PROVIDER must be mysql" >&2
  exit 1
fi

if [ "${ENABLE_OCPP_PORT:-false}" = "true" ] && [ -z "${OCPP_SHARED_TOKEN:-}" ]; then
  echo "ERROR: OCPP_SHARED_TOKEN is required when OCPP is enabled" >&2
  exit 1
fi

if [ -n "${MERCADO_PAGO_ACCESS_TOKEN:-}" ] && [ -z "${MERCADO_PAGO_WEBHOOK_SECRET:-}" ]; then
  echo "ERROR: MERCADO_PAGO_WEBHOOK_SECRET is required with a live gateway" >&2
  exit 1
fi

if [ -n "${SMTP_HOST:-}" ] && { [ -z "${SMTP_USER:-}" ] || [ -z "${SMTP_PASS:-}" ]; }; then
  echo "ERROR: SMTP_USER and SMTP_PASS are required when SMTP_HOST is set" >&2
  exit 1
fi

if [ ! -f "$ROOT_DIR/backend/prisma/migrations_mysql/migration_lock.toml" ] ||
   ! find "$ROOT_DIR/backend/prisma/migrations_mysql" -name '*.sql' -print -quit | grep -q .; then
  echo "ERROR: MySQL migrations are missing" >&2
  exit 1
fi

(cd "$ROOT_DIR/backend" && npx prisma validate --schema=prisma/schema.mysql.prisma >/dev/null)
echo "Production preflight passed"
