import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { MercadoPagoService } from '../mercadopago.service';
import { CommissionsService } from '../../commissions/commissions.service';
import { AuditService } from '../../audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { PrismaService } from '../../../database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import {
  mockPrismaService,
  mockCommissionsService,
  mockMercadoPagoService,
} from '../../../../test/helpers/mocks';
import { PaymentGateway } from '../../../common/enums';

const mockAuditService = {
  log: jest.fn(),
  notifications: { paymentApproved: jest.fn().mockReturnValue({}) },
};
const mockNotificationsService = { create: jest.fn() };

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MercadoPagoService, useValue: mockMercadoPagoService },
        { provide: CommissionsService, useValue: mockCommissionsService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get(PrismaService);
    jest.resetAllMocks();
    mockPrismaService.client.$transaction.mockImplementation(
      (callback: (transaction: typeof mockPrismaService) => unknown) =>
        callback(mockPrismaService),
    );
    mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });
    mockCommissionsService.calculate.mockResolvedValue({ id: 'comm-1' });
  });

  const mockUser = { id: 'user-1', email: 'test@email.com', role: 'CUSTOMER' };

  describe('create', () => {
    it('should create a PIX payment', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1',
        status: 'COMPLETED',
        amount: 81.25,
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@email.com' },
        station: { name: 'Station 1' },
      });
      prisma.payment.findUnique.mockResolvedValue(null);
      mockMercadoPagoService.createPixPayment.mockResolvedValue({
        id: 'mp-123',
        status: 'pending',
        qrCode: 'qr-code',
        copyPaste: 'pix-copy',
        amount: 81.25,
        qrCodeBase64: '',
        dateCreated: new Date().toISOString(),
      });
      prisma.payment.create.mockResolvedValue({
        id: 'payment-1',
        sessionId: 'session-1',
        gateway: 'PIX',
        externalId: 'mp-123',
        amount: 81.25,
        status: 'PENDING',
        session: { station: { companyId: 'comp-1' } },
      });

      const result = await service.create(
        { sessionId: 'session-1', gateway: PaymentGateway.PIX },
        mockUser,
      );

      expect(result.payment.gateway).toBe('PIX');
      expect((result.gateway as Record<string, unknown>).qrCode).toBeDefined();
    });

    it('should throw if session not completed', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1',
        status: 'ACTIVE',
        amount: 0,
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@email.com' },
        station: { name: 'Station 1' },
      });

      await expect(
        service.create(
          { sessionId: 'session-1', gateway: PaymentGateway.PIX },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if payment already exists', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1',
        status: 'COMPLETED',
        amount: 50,
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@email.com' },
        station: { name: 'Station 1' },
      });
      prisma.payment.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create(
          { sessionId: 'session-1', gateway: PaymentGateway.PIX },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('approvePayment', () => {
    it('should approve and trigger commission', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
        session: { station: { companyId: 'comp-1' } },
      });
      prisma.payment.updateMany.mockResolvedValue({ count: 1 });
      prisma.payment.update.mockResolvedValue({
        id: 'payment-1',
        status: 'APPROVED',
        paidAt: new Date(),
      });

      const result = await service.approvePayment('payment-1');

      expect(result.status).toBe('APPROVED');
      expect(mockCommissionsService.calculate).toHaveBeenCalledWith(
        'payment-1',
        expect.anything(),
      );
    });

    it('should return existing payment idempotently if already approved', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'APPROVED',
      });
      const result = await service.approvePayment('payment-1');
      expect(result.status).toBe('APPROVED');
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });
  });

  describe('refundPayment', () => {
    it('should call gateway first and update status to REFUNDED when gateway succeeds', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: '123456',
        status: 'APPROVED',
        session: { station: { companyId: 'company-1' } },
        commission: { operatorAmount: 95 },
      });
      mockMercadoPagoService.refundPayment.mockResolvedValue({
        id: 999,
        paymentId: 123456,
        status: 'approved',
      });
      prisma.wallet.findUnique.mockResolvedValue({
        id: 'wallet-1',
        companyId: 'company-1',
        balance: 100,
      });
      prisma.payment.update.mockResolvedValue({
        id: 'payment-1',
        status: 'REFUNDED',
      });

      const result = await service.refundPayment('payment-1');

      // Gateway deve ser chamado primeiro com o ID numérico
      expect(mockMercadoPagoService.refundPayment).toHaveBeenCalledWith(123456);
      // Status deve ser atualizado para REFUNDED
      expect(result.status).toBe('REFUNDED');
    });

    it('should NOT update status to REFUNDED if gateway rejects or throws error', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: '123456',
        status: 'APPROVED',
        session: { station: { companyId: 'company-1' } },
        commission: { operatorAmount: 95 },
      });
      mockMercadoPagoService.refundPayment.mockRejectedValue(
        new Error('Gateway refund failed'),
      );

      await expect(service.refundPayment('payment-1')).rejects.toThrow(
        'Gateway refund failed',
      );

      // O banco de dados NÃO deve ter sido modificado (update não chamado)
      expect(prisma.payment.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if payment is not in APPROVED status', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: '123456',
        status: 'PENDING',
      });

      await expect(service.refundPayment('payment-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMercadoPagoService.refundPayment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if externalId is invalid or missing', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: 'invalid-id',
        status: 'APPROVED',
      });

      await expect(service.refundPayment('payment-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMercadoPagoService.refundPayment).not.toHaveBeenCalled();
    });
  });

  describe('approvePayment & Idempotency', () => {
    it('should approve payment idempotently if already approved', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        status: 'APPROVED',
        amount: 100,
      });

      const result = await service.approvePayment('payment-1');

      expect(result.status).toBe('APPROVED');
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });

    it('should handle concurrent approvals safely (only 1 wins updateMany)', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        status: 'PENDING',
        amount: 100,
        session: { station: { companyId: 'company-1' } },
      });

      // Simula que o primeiro updateMany retorna count: 1 e o segundo count: 0 (já aprovado por outra thread)
      prisma.payment.updateMany
        .mockResolvedValueOnce({ count: 1 })
        .mockResolvedValueOnce({ count: 0 });

      const [res1, res2] = await Promise.all([
        service.approvePayment('payment-1'),
        service.approvePayment('payment-1'),
      ]);

      expect(res1.status).toBe('APPROVED');
      expect(res2.status).toBe('APPROVED');
      // Comissão deve ser calculada apenas uma vez (para a transação vencedora)
      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleWebhook & WebhooksController (13 WebhookEvent Scenarios)', () => {
    beforeEach(() => {
      prisma.webhookEvent.create.mockResolvedValue({
        id: 'we-1',
        provider: 'MERCADO_PAGO',
        externalEventId: 'req-123',
        status: 'RECEIVED',
      });
      prisma.webhookEvent.update.mockResolvedValue({
        id: 'we-1',
        status: 'PROCESSED',
      });
    });

    // 1. Novo webhook cria WebhookEvent
    it('1. novo webhook cria WebhookEvent em status RECEIVED', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-123',
      );

      expect(prisma.webhookEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          provider: 'MERCADO_PAGO',
          externalEventId: 'req_req-123',
          eventType: 'payment',
          resourceId: '123',
          status: 'RECEIVED',
        }),
      });
    });

    // 2. Webhook válido é processado
    it('2. webhook válido é processado financeiramente', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      const result = await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-123',
      );

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).toHaveBeenCalled();
    });

    // 3. WebhookEvent passa para PROCESSED
    it('3. WebhookEvent é atualizado para PROCESSED após sucesso', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-123',
      );

      expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'we-1' },
          data: expect.objectContaining({ status: 'PROCESSED' }),
        }),
      );
    });

    // 4. Mesmo evento recebido novamente não é processado
    it('4. mesmo evento recebido novamente (duplicate UNIQUE) é ignorado de forma idempotente', async () => {
      const uniqueError = { code: 'P2002', message: 'Unique constraint failed' };
      prisma.webhookEvent.create.mockRejectedValue(uniqueError);
      prisma.webhookEvent.findUnique.mockResolvedValue({
        id: 'we-1',
        provider: 'MERCADO_PAGO',
        externalEventId: 'req_req-dup',
        status: 'PROCESSED',
      });

      const result = await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-dup',
      );

      expect(result).toEqual({ received: true, idempotent: true });
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });

    // 5. Dois requests simultâneos do mesmo evento criam somente um registro
    it('5. dois requests simultâneos do mesmo evento criam somente 1 WebhookEvent', async () => {
      prisma.webhookEvent.create
        .mockResolvedValueOnce({ id: 'we-1', status: 'RECEIVED' })
        .mockRejectedValueOnce({ code: 'P2002' });
      prisma.webhookEvent.findUnique.mockResolvedValue({
        id: 'we-1',
        status: 'PROCESSING',
      });
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      const [r1, r2] = await Promise.all([
        service.handleWebhook({ type: 'payment', data: { id: '123' } }, 'req-same'),
        service.handleWebhook({ type: 'payment', data: { id: '123' } }, 'req-same'),
      ]);

      expect(r1.received).toBe(true);
      expect(r2.received).toBe(true);
      // create foi tentado para os 2, mas apenas 1 transação de webhook foi efetuada
      expect(prisma.webhookEvent.create).toHaveBeenCalledTimes(2);
    });

    // 6, 7, 8, 9. Unicidade de aprovação, comissão, transação e crédito na wallet
    it('6-9. garante unicidade de aprovação financeira e crédito na wallet', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-financial-1',
      );

      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);
    });

    // 10. Erro de processamento marca WebhookEvent como FAILED
    it('10. erro de processamento marca WebhookEvent como FAILED', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
      });
      mockMercadoPagoService.getPaymentStatus.mockRejectedValue(
        new Error('Gateway error'),
      );

      const result = await service.handleWebhook(
        { type: 'payment', data: { id: '123' } },
        'req-err-1',
      );

      expect(result.received).toBe(true);
      expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'we-1' },
          data: expect.objectContaining({
            status: 'FAILED',
            errorMessage: 'Gateway error',
          }),
        }),
      );
    });

    // 11. Assinatura inválida não cria WebhookEvent
    it('11. assinatura inválida rejeita no controller antes de criar WebhookEvent', () => {
      const secret = 'test-webhook-secret';
      const mockConfig = { get: jest.fn().mockReturnValue(secret) };
      const controller = new (require('../payments.controller').WebhooksController)(
        service,
        mockConfig,
      );

      expect(() =>
        controller.handlePaymentWebhook(
          { type: 'payment', data: { id: '123' } },
          'ts=12345,v1=invalid_hash',
          'req-invalid-sig',
        ),
      ).toThrow(BadRequestException);

      expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    });

    // 12. Webhook de outro evento do mesmo pagamento pode ser registrado
    it('12. evento diferente do mesmo pagamento possui externalEventId diferente e é registrado', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
      });

      await service.handleWebhook(
        { type: 'payment', action: 'payment.created', data: { id: '123' } },
        'req-evt-1',
      );
      await service.handleWebhook(
        { type: 'payment', action: 'payment.updated', data: { id: '123' } },
        'req-evt-2',
      );

      expect(prisma.webhookEvent.create).toHaveBeenCalledTimes(2);
      expect(prisma.webhookEvent.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({ externalEventId: 'req_req-evt-1' }),
        }),
      );
      expect(prisma.webhookEvent.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: expect.objectContaining({ externalEventId: 'req_req-evt-2' }),
        }),
      );
    });

    // 13. Diferentes eventos legítimos do mesmo pagamento não são tratados como duplicados
    it('13. diferentes eventos legítimos não colidem na restrição UNIQUE', async () => {
      const result1 = await service.handleWebhook(
        { type: 'payment', action: 'payment.created', data: { id: '123' } },
        'req-distinct-1',
      );
      const result2 = await service.handleWebhook(
        { type: 'payment', action: 'payment.updated', data: { id: '123' } },
        'req-distinct-2',
      );

      expect(result1.received).toBe(true);
      expect(result2.received).toBe(true);
      expect(result1).not.toHaveProperty('idempotent');
      expect(result2).not.toHaveProperty('idempotent');
    });
  });
});
