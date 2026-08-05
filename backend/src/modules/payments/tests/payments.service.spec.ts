import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { MercadoPagoService } from '../mercadopago.service';
import { CommissionsService } from '../../commissions/commissions.service';
import { PrismaService } from '../../../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { mockPrismaService, mockCommissionsService, mockMercadoPagoService } from '../../../../test/helpers/mocks';
import { PaymentGateway } from '../../../common/enums';

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
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = mockPrismaService;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a PIX payment', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1', status: 'COMPLETED', amount: 81.25,
        user: { email: 'test@email.com' }, station: { name: 'Station 1' },
      });
      prisma.payment.findUnique.mockResolvedValue(null);
      mockMercadoPagoService.createPixPayment.mockResolvedValue({
        id: 'mp-123', status: 'pending', qrCode: 'qr-code', copyPaste: 'pix-copy', amount: 81.25,
        qrCodeBase64: '', dateCreated: new Date().toISOString(),
      });
      prisma.payment.create.mockResolvedValue({
        id: 'payment-1', sessionId: 'session-1', gateway: 'PIX', externalId: 'mp-123',
        amount: 81.25, status: 'PENDING', session: { station: { companyId: 'comp-1' } },
      });

      const result = await service.create({ sessionId: 'session-1', gateway: PaymentGateway.PIX }, 'test@email.com');

      expect(result.payment.gateway).toBe('PIX');
      expect(result.gateway.qrCode).toBeDefined();
    });

    it('should throw if session not completed', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1', status: 'ACTIVE', amount: 0,
        user: { email: 'test@email.com' }, station: { name: 'Station 1' },
      });

      await expect(service.create({ sessionId: 'session-1', gateway: PaymentGateway.PIX })).rejects.toThrow(BadRequestException);
    });

    it('should throw if payment already exists', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1', status: 'COMPLETED', amount: 50,
        user: { email: 'test@email.com' }, station: { name: 'Station 1' },
      });
      prisma.payment.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.create({ sessionId: 'session-1', gateway: PaymentGateway.PIX })).rejects.toThrow(BadRequestException);
    });
  });

  describe('approvePayment', () => {
    it('should approve and trigger commission', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1', amount: 100, status: 'PENDING', externalId: 'mp-123',
        session: { station: { companyId: 'comp-1' } },
      });
      prisma.payment.update.mockResolvedValue({ id: 'payment-1', status: 'APPROVED', paidAt: new Date() });

      const result = await service.approvePayment('payment-1');

      expect(result.status).toBe('APPROVED');
      expect(mockCommissionsService.calculate).toHaveBeenCalledWith('payment-1');
    });

    it('should throw if already approved', async () => {
      prisma.payment.findUnique.mockResolvedValue({ id: 'payment-1', status: 'APPROVED' });
      await expect(service.approvePayment('payment-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('refundPayment', () => {
    it('should refund approved payment', async () => {
      prisma.payment.findUnique.mockResolvedValue({ id: 'payment-1', status: 'APPROVED' });
      prisma.payment.update.mockResolvedValue({ id: 'payment-1', status: 'REFUNDED' });

      expect((await service.refundPayment('payment-1')).status).toBe('REFUNDED');
    });

    it('should throw if not approved', async () => {
      prisma.payment.findUnique.mockResolvedValue({ id: 'payment-1', status: 'PENDING' });
      await expect(service.refundPayment('payment-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should approve on webhook notification', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'payment-1', amount: 100, status: 'PENDING', externalId: 'mp-123',
        session: { station: { companyId: 'comp-1' } },
      });
      prisma.payment.update.mockResolvedValue({ id: 'payment-1', status: 'APPROVED', paidAt: new Date() });
      mockMercadoPagoService.getPaymentStatus.mockResolvedValue({ id: 123, status: 'approved' });

      const result = await service.handleWebhook({ type: 'payment', data: { id: '123' } });

      expect(result.received).toBe(true);
      expect(mockCommissionsService.calculate).toHaveBeenCalled();
    });
  });
});
