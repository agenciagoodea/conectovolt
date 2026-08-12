import { Module } from '@nestjs/common';
import { ChargersController } from './chargers.controller';
import { ChargersService } from './chargers.service';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { OcppModule } from '../ocpp/ocpp.module';
import { ChargingModule } from '../charging/charging.module';

@Module({
  imports: [OcppModule, ChargingModule],
  controllers: [ChargersController, ConnectorsController],
  providers: [ChargersService, ConnectorsService],
  exports: [ChargersService, ConnectorsService],
})
export class ChargersModule {}
