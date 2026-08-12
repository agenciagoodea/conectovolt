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
    jest.clearAllMocks();
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
      prisma.payment.update.mockResolvedValue({
        id: 'payment-1',
        status: 'APPROVED',
        paidAt: new Date(),
      });

      const result = await service.approvePayment('payment-1');

      expect(result.status).toBe('APPROVED');
      expect(mockCommissionsService.calculate).toHaveBeenCalledWith(
        'payment-1',
      );
    });

    it('should throw if already approved', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        status: 'APPROVED',
      });
      await expect(service.approvePayment('payment-1')).rejects.toThrow(
        BadRequestException,
      );
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

  describe('handleWebhook', () => {
    it('should approve on webhook notification', async () => {
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
      prisma.payment.update.mockResolvedValue({
        id: 'payment-1',
        status: 'APPROVED',
        paidAt: new Date(),
      });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({
        id: 123,
        status: 'approved',
      });

      const result = await service.handleWebhook({
        type: 'payment',
        data: { id: '123' },
      });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).toHaveBeenCalled();
    });
  });
});
