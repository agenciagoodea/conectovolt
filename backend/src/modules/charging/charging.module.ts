import { Module } from '@nestjs/common';
import { ChargingController } from './charging.controller';
import { ChargingService } from './charging.service';
import { ChargingGateway } from './gateways/charging.gateway';

@Module({
  controllers: [ChargingController],
  providers: [ChargingService, ChargingGateway],
  exports: [ChargingService, ChargingGateway],
})
export class ChargingModule {}
