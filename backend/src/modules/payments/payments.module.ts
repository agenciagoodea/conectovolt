import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController, WebhooksController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MercadoPagoService } from './mercadopago.service';
import { CommissionsModule } from '../commissions/commissions.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [forwardRef(() => CommissionsModule), AuditModule, NotificationsModule],
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService, MercadoPagoService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
