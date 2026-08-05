import { Test, TestingModule } from '@nestjs/testing';
import { StationsService } from '../stations.service';
import { PrismaService } from '../../../database/prisma.service';

describe('StationsService', () => {
  let service: StationsService;

  const mockPrisma = {
    station: {
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
        StationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StationsService>(StationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list stations', async () => {
    const result = await service.findAll({});
    expect(result).toEqual([]);
  });

  it('should filter by city', async () => {
    await service.findAll({ city: 'SP' });
    expect(mockPrisma.station.findMany).toHaveBeenCalled();
  });

  it('should create station', async () => {
    mockPrisma.station.create.mockResolvedValue({ id: 's1', name: 'Posto 1', status: 'ACTIVE' });
    const result = await service.create({ name: 'Posto 1', address: 'Rua A', city: 'SP', state: 'SP', companyId: 'c1', latitude: 0, longitude: 0 });
    expect(result.name).toBe('Posto 1');
  });
});
