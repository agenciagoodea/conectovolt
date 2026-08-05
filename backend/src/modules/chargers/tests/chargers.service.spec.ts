import { Test, TestingModule } from '@nestjs/testing';
import { ChargersService } from '../chargers.service';
import { PrismaService } from '../../../database/prisma.service';

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargersService,
        { provide: PrismaService, useValue: mockPrisma },
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
    mockPrisma.charger.create.mockResolvedValue({ id: 'ch1', serialNumber: 'SN1', powerKw: 60, status: 'OFFLINE', stationId: 's1' });
    const result = await service.create({ stationId: 's1', serialNumber: 'SN1', powerKw: 60 });
    expect(result.serialNumber).toBe('SN1');
  });

  it('should update charger status', async () => {
    mockPrisma.charger.update.mockResolvedValue({ id: 'ch1', status: 'ONLINE' });
    const result = await service.updateStatus('ch1', { status: 'ONLINE' as any });
    expect(result.status).toBe('ONLINE');
  });
});
