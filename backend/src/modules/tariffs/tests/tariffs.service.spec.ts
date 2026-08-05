import { Test, TestingModule } from '@nestjs/testing';
import { TariffsService } from '../tariffs.service';
import { PrismaService } from '../../../database/prisma.service';

describe('TariffsService', () => {
  let service: TariffsService;

  const mockPrisma = {
    tariff: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    company: {
      findUnique: jest.fn().mockResolvedValue({ id: 'c1', name: 'Empresa' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TariffsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TariffsService>(TariffsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list tariffs', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should create tariff', async () => {
    mockPrisma.tariff.create.mockResolvedValue({ id: 't1', name: 'Tarifa Padrao', pricePerKwh: 2.5, isActive: true, companyId: 'c1' });
    const result = await service.create({ name: 'Tarifa Padrao', pricePerKwh: 2.5, companyId: 'c1' });
    expect(result.name).toBe('Tarifa Padrao');
  });

  it('should toggle tariff status', async () => {
    mockPrisma.tariff.findUnique.mockResolvedValue({ id: 't1', isActive: true });
    mockPrisma.tariff.update.mockResolvedValue({ id: 't1', isActive: false });
    const result = await service.toggleStatus('t1');
    expect(result.isActive).toBe(false);
  });
});
