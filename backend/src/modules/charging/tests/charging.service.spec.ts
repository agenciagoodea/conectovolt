import { Test, TestingModule } from '@nestjs/testing';
import { ChargingService } from '../charging.service';
import { ChargingGateway } from '../gateways/charging.gateway';
import { PrismaService } from '../../../database/prisma.service';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { mockPrismaService, mockChargingGateway } from '../../../../test/helpers/mocks';

describe('ChargingService', () => {
  let service: ChargingService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ChargingGateway, useValue: mockChargingGateway },
      ],
    }).compile();

    service = module.get<ChargingService>(ChargingService);
    prisma = mockPrismaService;
    jest.clearAllMocks();
  });

  describe('start', () => {
    const startDto = { chargerId: 'charger-1', connectorId: 'conn-1' };

    it('should start a charging session successfully', async () => {
      prisma.charger.findUnique.mockResolvedValue({
        id: 'charger-1', stationId: 'station-1', status: 'ONLINE', station: { tariff: null },
      });
      prisma.chargingSession.findFirst.mockResolvedValue(null);
      prisma.connector.findUnique.mockResolvedValue({ id: 'conn-1', chargerId: 'charger-1', status: 'AVAILABLE' });
      prisma.chargingSession.create.mockResolvedValue({
        id: 'session-1', userId: 'user-1', chargerId: 'charger-1', connectorId: 'conn-1',
        stationId: 'station-1', status: 'ACTIVE', startTime: new Date(), energyKwh: 0, amount: 0,
        user: { id: 'user-1', name: 'Test', email: 'test@email.com' },
        station: { id: 'station-1', name: 'Station 1' },
        charger: { id: 'charger-1', serialNumber: 'SN-001', model: 'Model X' },
      });

      const result = await service.start('user-1', startDto);

      expect(result.status).toBe('ACTIVE');
      expect(mockChargingGateway.emitSessionStarted).toHaveBeenCalled();
    });

    it('should throw NotFoundException if charger not found', async () => {
      prisma.charger.findUnique.mockResolvedValue(null);
      await expect(service.start('user-1', startDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if charger is not online', async () => {
      prisma.charger.findUnique.mockResolvedValue({ id: 'charger-1', status: 'OFFLINE', station: { tariff: null } });
      await expect(service.start('user-1', startDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user already has active session', async () => {
      prisma.charger.findUnique.mockResolvedValue({ id: 'charger-1', status: 'ONLINE', station: { tariff: null } });
      prisma.chargingSession.findFirst.mockResolvedValueOnce({ id: 'existing', status: 'ACTIVE' });
      await expect(service.start('user-1', startDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('stop', () => {
    it('should stop and calculate cost', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1', userId: 'user-1', chargerId: 'charger-1', connectorId: 'conn-1',
        status: 'ACTIVE', startTime: new Date(),
        station: { tariff: { id: 'tariff-1', isActive: true, pricePerKwh: 2.50 } },
      });
      prisma.chargingSession.update.mockResolvedValue({
        id: 'session-1', userId: 'user-1', status: 'COMPLETED', energyKwh: 32.5, amount: 81.25,
        startTime: new Date(), endTime: new Date(),
        user: { id: 'user-1', name: 'Test' }, station: { id: 'station-1', name: 'Station 1' },
        charger: { id: 'charger-1', serialNumber: 'SN-001' }, connector: { id: 'conn-1' },
      });

      const result = await service.stop('session-1', { energyKwh: 32.5 });

      expect(result.status).toBe('COMPLETED');
      expect(Number(result.amount)).toBe(81.25);
      expect(mockChargingGateway.emitSessionCompleted).toHaveBeenCalled();
    });

    it('should throw NotFoundException if session not found', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue(null);
      await expect(service.stop('nonexistent', { energyKwh: 10 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEnergy', () => {
    it('should update energy and emit real-time event', async () => {
      prisma.chargingSession.findUnique.mockResolvedValue({
        id: 'session-1', userId: 'user-1', chargerId: 'charger-1', status: 'ACTIVE', startTime: new Date(),
        energyKwh: 10, station: { tariff: { isActive: true, pricePerKwh: 2.50 } },
      });
      prisma.chargingSession.update.mockResolvedValue({
        id: 'session-1', userId: 'user-1', chargerId: 'charger-1', status: 'ACTIVE', energyKwh: 25.5,
        startTime: new Date(), station: { tariff: { isActive: true, pricePerKwh: 2.50 } },
      });

      const result = await service.updateEnergy('session-1', { energyKwh: 25.5 });

      expect(Number(result.energyKwh)).toBe(25.5);
      expect(result.currentAmount).toBe(63.75);
      expect(mockChargingGateway.emitSessionUpdate).toHaveBeenCalled();
    });
  });

  describe('getActiveSession', () => {
    it('should return null if no active session', async () => {
      prisma.chargingSession.findFirst.mockResolvedValue(null);
      expect(await service.getActiveSession('user-1')).toBeNull();
    });
  });
});
