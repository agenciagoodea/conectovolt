export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  company: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  station: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  charger: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  connector: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  vehicle: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  chargingSession: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  payment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  commission: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
  },
  wallet: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  transaction: { findMany: jest.fn(), create: jest.fn() },
  tariff: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const defaults: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d',
    };
    return defaults[key] || null;
  }),
};

export const mockChargingGateway = {
  emitSessionStarted: jest.fn(),
  emitSessionUpdate: jest.fn(),
  emitSessionCompleted: jest.fn(),
};

export const mockMercadoPagoService = {
  createPixPayment: jest.fn(),
  createCreditCardPayment: jest.fn(),
  getPaymentStatus: jest.fn(),
};

export const mockCommissionsService = {
  calculate: jest.fn(),
  getWalletBalance: jest.fn(),
  requestWithdrawal: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});
