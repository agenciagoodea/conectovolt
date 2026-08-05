#!/bin/bash
# EV Charge Platform - Deploy Script
set -e

echo "=== EV Charge Platform Deploy ==="

# Load env
if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
fi

# Check required vars
if [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
  echo "ERROR: DB_PASSWORD and JWT_SECRET must be set in .env.production"
  exit 1
fi

# Generate SSL if not exists
if [ ! -f ssl/cert.pem ]; then
  echo "Generating self-signed SSL..."
  mkdir -p ssl
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -subj "/C=BR/ST=SP/L=Sao Paulo/O=EVCharge/CN=localhost"
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
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy --schema=prisma/schema.mysql.prisma

echo ""
echo "=== Deploy Complete ==="
echo "API:      https://localhost/api/docs"
echo "Frontend: https://localhost"
echo "Health:   https://localhost/api/v1/health"
