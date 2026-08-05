import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../companies.service';
import { PrismaService } from '../../../database/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const mockPrisma = {
    company: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    wallet: {
      create: jest.fn().mockResolvedValue({ id: 'wallet-1', balance: 0 }),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list companies', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should create company and wallet', async () => {
    mockPrisma.company.create.mockResolvedValue({ id: 'c1', name: 'Test', document: '123', status: 'PENDING' });
    const result = await service.create({ name: 'Test', document: '123' });
    expect(result).toBeDefined();
    expect(mockPrisma.wallet.create).toHaveBeenCalled();
  });

  it('should approve company', async () => {
    mockPrisma.company.findUnique.mockResolvedValue({ id: 'c1', status: 'PENDING' });
    mockPrisma.company.update.mockResolvedValue({ id: 'c1', status: 'ACTIVE' });
    const result = await service.approve('c1');
    expect(result.status).toBe('ACTIVE');
  });
});
