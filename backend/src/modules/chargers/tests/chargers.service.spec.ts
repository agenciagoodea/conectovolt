import { Test, TestingModule } from '@nestjs/testing';
import { ChargersService } from '../chargers.service';
import { PrismaService } from '../../../database/prisma.service';
import { OcppService } from '../../ocpp/ocpp.service';
import { ChargerStatus } from '../../../common/enums';

describe('ChargersService', () => {
  let service: ChargersService;

  const mockPrisma = {
    charger: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    station: {
      findUnique: jest
        .fn()
        .mockResolvedValue({ id: 's1', companyId: 'comp-1' }),
    },
  };

  const mockOcppService = {
    getConnection: jest.fn(),
    connections: new Map(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: OcppService, useValue: mockOcppService },
      ],
    }).compile();

    service = module.get<ChargersService>(ChargersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list chargers', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should create charger', async () => {
    mockPrisma.charger.create.mockResolvedValue({
      id: 'ch1',
      serialNumber: 'SN1',
      powerKw: 60,
      status: 'OFFLINE',
      stationId: 's1',
    });
    const result = await service.create({
      stationId: 's1',
      serialNumber: 'SN1',
      powerKw: 60,
    });
    expect(result.serialNumber).toBe('SN1');
  });

  it('should update charger status', async () => {
    mockPrisma.charger.findUnique.mockResolvedValue({
      id: 'ch1',
      status: 'OFFLINE',
      station: { companyId: 'comp-1' },
    });
    mockPrisma.charger.update.mockResolvedValue({
      id: 'ch1',
      status: 'ONLINE',
    });
    const result = await service.updateStatus('ch1', {
      status: ChargerStatus.ONLINE,
    });
    expect(result.status).toBe('ONLINE');
  });
});
