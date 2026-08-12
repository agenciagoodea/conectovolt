import { Module, forwardRef } from '@nestjs/common';
import { ChargingController } from './charging.controller';
import { ChargingService } from './charging.service';
import { ChargingGateway } from './gateways/charging.gateway';
import { OcppModule } from '../ocpp/ocpp.module';

@Module({
  imports: [forwardRef(() => OcppModule)],
  controllers: [ChargingController],
  providers: [ChargingService, ChargingGateway],
  exports: [ChargingService, ChargingGateway],
})
export class ChargingModule {}
