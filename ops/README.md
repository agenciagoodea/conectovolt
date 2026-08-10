# Production Operations

## MySQL backup

Run `backup-mysql.sh` from a protected scheduler such as cron. Supply database credentials through the process environment, never in this repository.

Example daily cron entry:

```cron
15 2 * * * DB_HOST=127.0.0.1 DB_NAME=conectovolt DB_USER=backup DB_PASSWORD='***' BACKUP_DIR=/var/backups/conectovolt /opt/conectovolt/ops/backup-mysql.sh >> /var/log/conectovolt-backup.log 2>&1
```

Backups must be copied to independent storage and a restore test must be performed at least monthly.

## Local development against VPS database

Run `configure-local-online.ps1` once, then keep `start-online-db-tunnel.ps1` running before starting the local backend. The local backend connects to `127.0.0.1:3307`, which is forwarded through SSH to the VPS MariaDB on `127.0.0.1:3306`.

## Production preflight

Run `preflight-production.sh` before a deploy. It validates required secrets, MySQL as the production provider, OCPP/gateway dependencies and the migration directory without printing secret values.
