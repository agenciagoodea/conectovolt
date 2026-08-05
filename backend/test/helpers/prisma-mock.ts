export const PrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  company: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  station: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  charger: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  connector: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  vehicle: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  chargingSession: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
  payment: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  commission: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), aggregate: jest.fn() },
  wallet: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  transaction: { findMany: jest.fn(), create: jest.fn() },
  tariff: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
}));

export const $Enums: any = {};

export enum UserRole { SUPER_ADMIN = 'SUPER_ADMIN', OPERATOR = 'OPERATOR', CUSTOMER = 'CUSTOMER' }
export enum CompanyStatus { PENDING = 'PENDING', ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
export enum StationStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE', MAINTENANCE = 'MAINTENANCE' }
export enum ChargerStatus { ONLINE = 'ONLINE', OFFLINE = 'OFFLINE', ERROR = 'ERROR' }
export enum ConnectorType { TYPE2 = 'TYPE2', CCS = 'CCS', CHADEMO = 'CHADEMO' }
export enum ConnectorStatus { AVAILABLE = 'AVAILABLE', CHARGING = 'CHARGING', FAULT = 'FAULT', UNAVAILABLE = 'UNAVAILABLE' }
export enum ChargingSessionStatus { PENDING = 'PENDING', ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export enum PaymentStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', FAILED = 'FAILED', REFUNDED = 'REFUNDED' }
export enum PaymentGateway { PIX = 'PIX', CREDIT_CARD = 'CREDIT_CARD' }
export enum TransactionType { CREDIT = 'CREDIT', DEBIT = 'DEBIT', WITHDRAWAL = 'WITHDRAWAL', COMMISSION = 'COMMISSION' }
export enum WithdrawalStatus { PENDING = 'PENDING', UNDER_REVIEW = 'UNDER_REVIEW', PROCESSING = 'PROCESSING', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
