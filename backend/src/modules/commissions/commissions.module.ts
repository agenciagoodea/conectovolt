import { Module } from '@nestjs/common';
import {
  CommissionsController,
  WalletController,
} from './commissions.controller';
import { CommissionsService } from './commissions.service';

@Module({
  controllers: [CommissionsController, WalletController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}
