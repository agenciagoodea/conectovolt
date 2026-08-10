#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/home/conectovolt/app}"
ENV_FILE="${ENV_FILE:-$APP_ROOT/backend/.env.production.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: production env file not found" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

eval "$(python3 - "$DATABASE_URL" <<'PY'
import shlex
import sys
from urllib.parse import unquote, urlparse

parsed = urlparse(sys.argv[1])
values = {
    "DB_HOST": parsed.hostname or "127.0.0.1",
    "DB_PORT": str(parsed.port or 3306),
    "DB_NAME": parsed.path.lstrip("/"),
    "DB_USER": unquote(parsed.username or ""),
    "DB_PASSWORD": unquote(parsed.password or ""),
}
for key, value in values.items():
    print(f"export {key}={shlex.quote(value)}")
PY
 )"

export BACKUP_DIR="${BACKUP_DIR:-$APP_ROOT/../backups/mysql}"
export BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
export BACKUP_SCRIPT="${BACKUP_SCRIPT:-$APP_ROOT/ops/backup-mysql.sh}"
exec "$BACKUP_SCRIPT"
