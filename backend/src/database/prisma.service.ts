import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../generated/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _client: PrismaClient | null = null;

  async onModuleInit() {
    try {
      const provider = process.env.DB_PROVIDER || 'sqlite';

      if (provider === 'sqlite') {
        const { PrismaLibSql } = await import('@prisma/adapter-libsql');
        const adapter = new PrismaLibSql({
          url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
        });
        this._client = new PrismaClient({
          adapter,
          log:
            process.env.NODE_ENV === 'development'
              ? ['warn', 'error']
              : ['error'],
        });
      } else if (provider === 'mysql') {
        const { PrismaMariaDb } = await import('@prisma/adapter-mariadb');
        let dbUrl = (process.env.DATABASE_URL || '').replace(
          /^mysql:\/\//,
          'mariadb://',
        );
        const separator = dbUrl.includes('?') ? '&' : '?';
        dbUrl += `${separator}connectTimeout=5000&acquireTimeout=10000`;
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Database connection failed: ${message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this._client) {
      try {
        await this._client.$disconnect();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Database disconnect error: ${message}`);
      }
    }
  }

  get client(): PrismaClient {
    if (!this._client) {
      throw new Error('PrismaClient has not been initialized');
    }
    return this._client;
  }

  get user() {
    return this.client.user;
  }
  get company() {
    return this.client.company;
  }
  get station() {
    return this.client.station;
  }
  get charger() {
    return this.client.charger;
  }
  get connector() {
    return this.client.connector;
  }
  get vehicle() {
    return this.client.vehicle;
  }
  get chargingSession() {
    return this.client.chargingSession;
  }
  get payment() {
    return this.client.payment;
  }
  get commission() {
    return this.client.commission;
  }
  get wallet() {
    return this.client.wallet;
  }
  get transaction() {
    return this.client.transaction;
  }
  get tariff() {
    return this.client.tariff;
  }
  get notification() {
    return this.client.notification;
  }
  get auditLog() {
    return this.client.auditLog;
  }
  get plan() {
    return this.client.plan;
  }
  get subscription() {
    return this.client.subscription;
  }
  get platformUsage() {
    return this.client.platformUsage;
  }
  get telemetryEvent() {
    return this.client.telemetryEvent;
  }
  get alert() {
    return this.client.alert;
  }
  get maintenanceRecord() {
    return this.client.maintenanceRecord;
  }
  get stationImage() {
    return this.client.stationImage;
  }
}
