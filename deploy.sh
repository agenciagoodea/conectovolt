#!/bin/bash
# ConectoVolt - Deploy Script
set -e

echo "=== ConectoVolt Deploy ==="

# Load secrets kept outside the repository.
ENV_FILE=".env.production.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE is required and must not be committed"
  exit 1
fi
set -a
. "$ENV_FILE"
set +a

bash ops/preflight-production.sh "$ENV_FILE"

# Check required vars
if [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$JWT_REFRESH_SECRET" ] || [ -z "$DATABASE_URL" ]; then
  echo "ERROR: database URL, database password and JWT secrets must be set in $ENV_FILE"
  exit 1
fi

# Generate SSL if not exists
if [ ! -f ssl/cert.pem ]; then
  echo "Generating self-signed SSL..."
  mkdir -p ssl
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -subj "/C=BR/ST=SP/L=Sao Paulo/O=ConectoVolt/CN=localhost"
fi

# Pull latest changes
echo "Pulling latest code..."
git pull origin main 2>/dev/null || echo "  (git not configured, skipping)"

# Build and deploy
echo "Building containers..."
docker compose -f docker-compose.prod.yml build

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "Running migrations..."
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

echo ""
echo "=== Deploy Complete ==="
echo "API:      https://localhost/api/docs"
echo "Frontend: https://localhost"
echo "Health:   https://localhost/api/v1/health"
