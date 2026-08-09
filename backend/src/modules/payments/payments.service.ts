import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { MercadoPagoService } from './mercadopago.service';
import { CommissionsService } from '../commissions/commissions.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentGateway, PaymentStatus } from '../../common/enums';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mercadoPagoService: MercadoPagoService,
    @Inject(forwardRef(() => CommissionsService))
    private readonly commissionsService: CommissionsService,
    @Inject(forwardRef(() => AuditService))
    private readonly auditService: AuditService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    dto: CreatePaymentDto,
    user: { id: string; email: string; role: string },
  ) {
    const session = await this.prisma.chargingSession.findUnique({
      where: { id: dto.sessionId },
      include: {
        user: { select: { id: true, email: true } },
        station: { select: { name: true } },
      },
    });

    if (!session) {
      throw new NotFoundException('Charging session not found');
    }

    if (session.userId !== user.id) {
      throw new ForbiddenException('You do not own this session');
    }

    if (session.status !== 'COMPLETED') {
      throw new BadRequestException('Charging session is not completed yet');
    }

    if (Number(session.amount) <= 0) {
      throw new BadRequestException('Session has no amount to charge');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { sessionId: dto.sessionId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this session');
    }

    const description = `Recarga - ${session.station.name}`;
    const payerEmail = user.email || session.user.email;

    let gatewayResult: Record<string, unknown>;

    if (dto.gateway === PaymentGateway.PIX) {
      gatewayResult = await this.mercadoPagoService.createPixPayment(
        Number(session.amount),
        description,
        payerEmail,
      );
    } else if (dto.gateway === PaymentGateway.CREDIT_CARD) {
      gatewayResult = await this.mercadoPagoService.createCreditCardPayment(
        Number(session.amount),
        description,
        payerEmail,
        '',
      );
    } else {
      throw new BadRequestException('Invalid payment gateway');
    }

    const payment = await this.prisma.payment.create({
      data: {
        sessionId: dto.sessionId,
        gateway: dto.gateway,
        externalId: String(gatewayResult.id),
        amount: session.amount,
        status: 'PENDING',
      },
      include: { session: { include: { station: true } } },
    });

    this.logger.log(
      `Payment created: ${payment.id} (${dto.gateway}) - R$${session.amount}`,
    );

    return {
      payment: {
        id: payment.id,
        sessionId: payment.sessionId,
        gateway: payment.gateway,
        amount: Number(payment.amount),
        status: payment.status,
      },
      gateway: {
        ...gatewayResult,
        paymentId: payment.id,
      },
    };
  }

  async findById(id: string, user?: { id: string; role: string }) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            station: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, email: true } },
            charger: { select: { id: true, serialNumber: true } },
          },
        },
        commission: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      user &&
      user.role === 'CUSTOMER' &&
      payment.session?.userId !== user.id
    ) {
      throw new ForbiddenException('You do not own this payment');
    }

    return payment;
  }

  async findBySession(sessionId: string) {
    return this.prisma.payment.findUnique({
      where: { sessionId },
      include: { commission: true },
    });
  }

  async approvePayment(paymentId: string, externalId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { session: { include: { station: true } } },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'APPROVED') {
      throw new BadRequestException('Payment is already approved');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'APPROVED',
        externalId: externalId || payment.externalId,
        paidAt: new Date(),
      },
    });

    this.logger.log(`Payment approved: ${paymentId} - R$${payment.amount}`);

    try {
      await this.commissionsService.calculate(paymentId);
    } catch (error) {
      const err = error as { message?: string };
      this.logger.error(
        `Failed to calculate commission for payment ${paymentId}: ${err.message ?? 'unknown error'}`,
      );
    }

    // Audit log
    try {
      await this.auditService.log({
        userId: payment.session?.userId,
        action: 'PAYMENT_APPROVED',
        entity: 'Payment',
        entityId: paymentId,
        newValue: { amount: payment.amount, status: 'APPROVED' },
      });
    } catch {
      this.logger.warn(`Failed to write audit log for payment ${paymentId}`);
    }

    // Send notification
    try {
      const notif = this.auditService.notifications.paymentApproved(
        payment.session?.userId || '',
        Number(payment.amount),
      );
      await this.notificationsService.create(notif);
    } catch {
      this.logger.warn(`Failed to send notification for payment ${paymentId}`);
    }

    return updatedPayment;
  }

  async failPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'FAILED' },
    });
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.status !== 'APPROVED') {
      throw new BadRequestException('Only approved payments can be refunded');
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });
  }

  async handleWebhook(data: {
    action?: string;
    data?: { id?: string | number };
    type?: string;
  }) {
    this.logger.log(`Webhook received: ${JSON.stringify(data)}`);

    if (data.type === 'payment' && data.data?.id) {
      const mercadoPagoPaymentId = String(data.data.id);
      const numericId = Number(mercadoPagoPaymentId);

      if (!mercadoPagoPaymentId || Number.isNaN(numericId)) {
        this.logger.warn('Webhook received invalid payment id');
        return { received: true };
      }

      try {
        const mpStatus =
          await this.mercadoPagoService.getPaymentStatus(numericId);

        const payment = await this.prisma.payment.findFirst({
          where: { externalId: mercadoPagoPaymentId },
        });

        if (!payment) {
          this.logger.warn(
            `Payment not found for external ID: ${mercadoPagoPaymentId}`,
          );
          return { received: true };
        }

        switch (mpStatus.status) {
          case 'approved':
            await this.approvePayment(payment.id, mercadoPagoPaymentId);
            break;
          case 'rejected':
          case 'cancelled':
            await this.failPayment(payment.id);
            break;
          default:
            this.logger.log(`Payment ${payment.id} status: ${mpStatus.status}`);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error processing webhook: ${message}`);
      }
    }

    return { received: true };
  }

  async getPaymentsByStatus(status: string) {
    return this.prisma.payment.findMany({
      where: { status: status as PaymentStatus },
      include: {
        session: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            station: { select: { id: true, name: true } },
          },
        },
        commission: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
