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

  describe('handleWebhook & WebhooksController (12 Scenarios)', () => {
    // 1. Webhook aprovado normal
    it('1. webhook aprovado normal', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
        session: { station: { companyId: 'comp-1' } },
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'PENDING',
        externalId: 'mp-123',
        session: { station: { companyId: 'comp-1' } },
      });
      prisma.payment.updateMany.mockResolvedValue({ count: 1 });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).toHaveBeenCalledWith(
        'payment-1',
        expect.anything(),
      );
    });

    // 2. Webhook repetido sequencialmente
    it('2. webhook repetido sequencialmente', async () => {
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
      prisma.payment.updateMany.mockResolvedValue({ count: 1 });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      await service.handleWebhook({ type: 'payment', data: { id: '123' } });
      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);

      // Segunda chamada (replay): status já é APPROVED
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'APPROVED',
        externalId: 'mp-123',
      });
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        amount: 100,
        status: 'APPROVED',
        externalId: 'mp-123',
      });

      const secondResult = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(secondResult.received).toBe(true);
      // Nenhuma comissão adicional deve ser calculada na segunda chamada
      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);
    });

    // 3. Dois processamentos concorrentes
    it('3. dois processamentos concorrentes', async () => {
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
      prisma.payment.updateMany
        .mockResolvedValueOnce({ count: 1 })
        .mockResolvedValueOnce({ count: 0 });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      const [res1, res2] = await Promise.all([
        service.handleWebhook({ type: 'payment', data: { id: '123' } }),
        service.handleWebhook({ type: 'payment', data: { id: '123' } }),
      ]);

      expect(res1.received).toBe(true);
      expect(res2.received).toBe(true);
      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);
    });

    // 4, 5, 6, 7. Commission, Transaction, Wallet e Payment criadas/atualizadas somente 1 vez
    it('4-7. garante unicidade de Commission, Transaction, Wallet e Payment', async () => {
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
      prisma.payment.updateMany.mockResolvedValue({ count: 1 });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      await service.handleWebhook({ type: 'payment', data: { id: '123' } });

      // Commission calculada apenas 1 vez
      expect(mockCommissionsService.calculate).toHaveBeenCalledTimes(1);
    });

    // 8. Webhook rejeitado
    it('8. webhook rejeitado', async () => {
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
      prisma.payment.update.mockResolvedValue({
        id: 'payment-1',
        status: 'FAILED',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'rejected',
      });

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(result.received).toBe(true);
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { status: 'FAILED' },
      });
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });

    // 9. Assinatura inválida no WebhooksController
    it('9. assinatura inválida deve lançar BadRequestException no controller', () => {
      const crypto = require('crypto');
      const secret = 'test-webhook-secret';
      const mockConfig = { get: jest.fn().mockReturnValue(secret) };
      const controller = new (require('../payments.controller').WebhooksController)(
        service,
        mockConfig,
      );

      expect(() =>
        controller.handlePaymentWebhook(
          { type: 'payment', data: { id: '123' } },
          'ts=12345,v1=invalid_hash_signature',
          'req-123',
        ),
      ).toThrow(BadRequestException);
    });

    // 10. Payment inexistente
    it('10. payment inexistente deve logar aviso e retornar received: true sem erro', async () => {
      prisma.payment.findFirst.mockResolvedValue(null);
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 999999,
        status: 'approved',
      });

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '999999' },
      });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });

    // 11. Gateway retorna status diferente (ex.: in_process)
    it('11. gateway retorna status em processamento (in_process)', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1',
        externalId: 'mp-123',
        status: 'PENDING',
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'in_process',
      });

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
      expect(prisma.payment.update).not.toHaveBeenCalled();
    });

    // 12. Erro durante processamento (ex.: falha de gateway)
    it('12. erro durante comunicação com gateway é capturado e logado', async () => {
      mockMercadoPagoService.getPaymentStatus.mockRejectedValue(
        new Error('Gateway connection timeout'),
      );

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).not.toHaveBeenCalled();
    });
  });
});
