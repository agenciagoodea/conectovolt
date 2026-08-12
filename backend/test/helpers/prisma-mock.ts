export class MockDecimal {
  private val: number;
  constructor(v: any) {
    this.val = typeof v === 'number' ? v : parseFloat(String(v));
  }
  mul(other: any) {
    const res = (this.val * Number(other)).toFixed(6);
    return new MockDecimal(parseFloat(res));
  }
  div(other: any) {
    const res = (this.val / Number(other)).toFixed(6);
    return new MockDecimal(parseFloat(res));
  }
  sub(other: any) {
    const res = (this.val - Number(other)).toFixed(6);
    return new MockDecimal(parseFloat(res));
  }
  add(other: any) {
    const res = (this.val + Number(other)).toFixed(6);
    return new MockDecimal(parseFloat(res));
  }
  toDecimalPlaces(dp: number) {
    return new MockDecimal(Number(this.val.toFixed(dp)));
  }
  lt(other: any) {
    return this.val < Number(other);
  }
  gte(other: any) {
    return this.val >= Number(other);
  }
  toNumber() {
    return this.val;
  }
  toString() {
    return String(this.val);
  }
  valueOf() {
    return this.val;
  }
  [Symbol.toPrimitive]() {
    return this.val;
  }
  ROUND_HALF_UP = 1;
}

export const Prisma = {
  Decimal: MockDecimal,
};

export const PrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  company: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
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
  wallet: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  transaction: { findMany: jest.fn(), create: jest.fn() },
  tariff: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  webhookEvent: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
}));

export const $Enums: any = {};

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR = 'OPERATOR',
  CUSTOMER = 'CUSTOMER',
}
export enum CompanyStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum StationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}
export enum ChargerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
}
export enum ConnectorType {
  TYPE2 = 'TYPE2',
  CCS = 'CCS',
  CHADEMO = 'CHADEMO',
}
export enum ConnectorStatus {
  AVAILABLE = 'AVAILABLE',
  CHARGING = 'CHARGING',
  FAULT = 'FAULT',
  UNAVAILABLE = 'UNAVAILABLE',
}
export enum ChargingSessionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
export enum PaymentGateway {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
}
export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  WITHDRAWAL = 'WITHDRAWAL',
  COMMISSION = 'COMMISSION',
}
export enum WithdrawalStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
