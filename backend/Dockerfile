FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json prisma.config.ts ./
RUN npm ci

COPY prisma/ ./prisma/
COPY src/ ./src/
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

RUN npx prisma generate --schema=prisma/schema.mysql.prisma
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy --schema=prisma/schema.mysql.prisma && node dist/src/main.js"
