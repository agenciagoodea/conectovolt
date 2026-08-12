# ConectoVolt Security Rules

## Secrets

- Production secrets must live in `backend/.env.production.local` on the server or in the deployment secret manager.
- Production environment files must never be committed.
- Rotate any credential that was previously present in Git history.
- `cpanel-deploy.ps1` reads `CPANEL_USER`, `CPANEL_PASSWORD` and `CPANEL_HOST` from the process environment.

## API

- Private routes require JWT Bearer authentication.
- Role guards protect administrative operations.
- Operator data is scoped by company in the service layer.
- Input validation uses a whitelist and rejects unknown fields.
- Payment webhooks require a configured signature secret.
- Rate limiting is enabled through Nest throttler.

## Hardware

- OCPP requires `OCPP_SHARED_TOKEN`.
- Unknown charger IDs are rejected during `BootNotification`.
- Remote commands must only be exposed to authenticated and authorized administrative routes.

## Financial Data

- Card data is represented by a gateway token and is never stored by ConectoVolt.
- Wallet withdrawals use a conditional transactional debit.
- Commission creation and wallet credit are committed in one database transaction.
- Payment approval is idempotent through the payment/commission uniqueness constraint.

## Release Checks

Before production:

```bash
bash ops/preflight-production.sh backend/.env.production.local
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm audit --omit=dev --audit-level=high
npx prisma migrate deploy
```

Also validate the critical driver flow with a real gateway sandbox and a registered charger.
