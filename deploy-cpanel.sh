#!/bin/bash
echo "=== 🚀 Iniciando Deploy Automatizado do ConectoVolt no cPanel ==="

BASE_DIR="/home/kryontecnologic/conectovolt"
cd $BASE_DIR || exit 1

echo "1. Puxando as atualizações mais recentes do GitHub..."
git pull origin master

echo "2. Configurando ambiente e compilando o Backend (NestJS)..."
if [ ! -f "$BASE_DIR/backend/.env.production.local" ]; then
  echo "ERRO: crie backend/.env.production.local fora do Git com os segredos de produção."
  exit 1
fi
cp "$BASE_DIR/backend/.env.production.local" "$BASE_DIR/backend/.env"
bash "$BASE_DIR/ops/preflight-production.sh" "$BASE_DIR/backend/.env.production.local"
cd $BASE_DIR/backend
npm install
npx prisma generate --schema=prisma/schema.mysql.prisma
npx prisma migrate deploy --schema=prisma/schema.mysql.prisma
npm run build

echo "3. Executando Seed de dados no Banco MySQL..."
npx prisma db seed --schema=prisma/schema.mysql.prisma

echo "4. Instalando dependências e compilando o Frontend (Next.js)..."
cd $BASE_DIR/frontend
npm install
NEXT_PUBLIC_API_URL=/api/v1 npm run build

echo "=== ✅ Deploy Automatizado Concluído com Sucesso! ==="
