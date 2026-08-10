# ConectoVolt Architecture

## Runtime

The platform is composed of:

- Next.js web application.
- Flutter mobile application.
- NestJS REST and WebSocket API.
- MySQL in production and SQLite for local development.
- Prisma as the data access layer.
- Socket.IO for charging updates.
- OCPP 1.6J listener for registered chargers.

The production request path is:

```text
Browser/Mobile -> Nginx -> Next.js
                         -> NestJS /api/v1
                         -> Socket.IO /socket.io
Charger -> OCPP listener -> NestJS -> Prisma -> MySQL
```

## Database Provider Selection

The Prisma client output is provider-specific. The provider must be selected before generating the client:

```bash
# Local
DB_PROVIDER=sqlite npm run prisma:generate:sqlite

# Production
DB_PROVIDER=mysql npm run prisma:generate:mysql
```

The `start` lifecycle generates the client from the active `DB_PROVIDER`. Production Docker images generate the MySQL client during the build.

## Isolation

Operator requests are scoped by `companyId` in controllers and services. Customers may access only their own vehicles, sessions and payments. Super Admin is the only role with global administrative access.

## Critical Flow

```text
Authenticate -> select station -> select charger -> start session
-> receive hardware telemetry -> stop session -> create payment
-> receive gateway confirmation -> commission/wallet ledger -> history
```

The flow requires a registered charger, a configured payment gateway and a valid operator wallet in production.
