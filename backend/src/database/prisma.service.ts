import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _client: any = null;

  async onModuleInit() {
    try {
      const { PrismaClient } = await import('../generated/client.js');
      const provider = process.env.DB_PROVIDER || 'sqlite';

      if (provider === 'sqlite') {
        const { PrismaLibSql } = await import('@prisma/adapter-libsql');
        const adapter = new PrismaLibSql({
          url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
        });
        this._client = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
        });
      } else if (provider === 'mysql') {
        const { PrismaMariaDb } = await import('@prisma/adapter-mariadb');
        const dbUrl = (process.env.DATABASE_URL || '').replace(/^mysql:\/\//, 'mariadb://');
        const adapter = new PrismaMariaDb(dbUrl);
        this._client = new PrismaClient({
          adapter,
          log: ['warn', 'error'],
        });
      } else {
        throw new Error(`Unsupported DB_PROVIDER: ${provider}`);
      }

      await this._client.$connect();
      this.logger.log(`Database connected (${provider})`);
    } catch (error) {
      this.logger.error(`Database connection failed: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    if (this._client) {
      try { await this._client.$disconnect(); } catch {}
    }
  }

  get user() { return this._client?.user; }
  get company() { return this._client?.company; }
  get station() { return this._client?.station; }
  get charger() { return this._client?.charger; }
  get connector() { return this._client?.connector; }
  get vehicle() { return this._client?.vehicle; }
  get chargingSession() { return this._client?.chargingSession; }
  get payment() { return this._client?.payment; }
  get commission() { return this._client?.commission; }
  get wallet() { return this._client?.wallet; }
  get transaction() { return this._client?.transaction; }
  get tariff() { return this._client?.tariff; }
  get notification() { return this._client?.notification; }
  get auditLog() { return this._client?.auditLog; }
  get plan() { return this._client?.plan; }
  get subscription() { return this._client?.subscription; }
  get platformUsage() { return this._client?.platformUsage; }
}
