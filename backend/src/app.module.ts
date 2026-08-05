import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
