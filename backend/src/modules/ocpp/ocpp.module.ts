import { Module, forwardRef } from '@nestjs/common';
import { OcppServer } from './ocpp-server';
import { OcppService } from './ocpp.service';
import { ChargingModule } from '../charging/charging.module';

@Module({
  imports: [forwardRef(() => ChargingModule)],
  providers: [OcppServer, OcppService],
  exports: [OcppService],
})
export class OcppModule {}
