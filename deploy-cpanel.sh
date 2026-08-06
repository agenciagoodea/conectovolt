#!/bin/bash
echo "=== 🚀 Iniciando Deploy Automatizado do ConectoVolt no cPanel ==="

BASE_DIR="/home/kryontecnologic/conectovolt"
cd $BASE_DIR || exit 1

echo "1. Puxando as atualizações mais recentes do GitHub..."
git pull origin master

echo "2. Configurando ambiente e compilando o Backend (NestJS)..."
cp $BASE_DIR/backend.env.production $BASE_DIR/backend/.env
cd $BASE_DIR/backend
npm install
npx prisma generate --schema=prisma/schema.mysql.prisma
npx prisma db push --schema=prisma/schema.mysql.prisma
npm run build

echo "3. Executando Seed de dados no Banco MySQL..."
node dist/prisma/seed.js

echo "4. Instalando dependências e compilando o Frontend (Next.js)..."
cd $BASE_DIR/frontend
npm install
npm run build

echo "=== ✅ Deploy Automatizado Concluído com Sucesso! ==="
