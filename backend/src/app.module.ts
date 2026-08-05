import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { StationsModule } from './modules/stations/stations.module';
import { ChargersModule } from './modules/chargers/chargers.module';
import { ChargingModule } from './modules/charging/charging.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { OcppModule } from './modules/ocpp/ocpp.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { BillingModule } from './modules/billing/billing.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 10,
    }, {
      name: 'medium',
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    StationsModule,
    ChargersModule,
    ChargingModule,
    PaymentsModule,
    CommissionsModule,
    DashboardModule,
    TariffsModule,
    VehiclesModule,
    OcppModule,
    SettingsModule,
    ReportsModule,
    NotificationsModule,
    AuditModule,
    BillingModule,
  ],
  controllers: [HealthController],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }],
})
export class AppModule {}
