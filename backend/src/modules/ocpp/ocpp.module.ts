import { Module } from '@nestjs/common';
import { OcppServer } from './ocpp-server';
import { OcppService } from './ocpp.service';

@Module({
  providers: [OcppServer, OcppService],
  exports: [OcppService],
})
export class OcppModule {}
