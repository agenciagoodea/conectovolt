import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController, WebhooksController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MercadoPagoService } from './mercadopago.service';
import { CommissionsModule } from '../commissions/commissions.module';

@Module({
  imports: [forwardRef(() => CommissionsModule)],
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService, MercadoPagoService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
