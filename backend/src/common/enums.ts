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

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum AlertType {
  CHARGER_OFFLINE = 'CHARGER_OFFLINE',
  CHARGER_FAULT = 'CHARGER_FAULT',
  HEARTBEAT_TIMEOUT = 'HEARTBEAT_TIMEOUT',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SESSION_STUCK = 'SESSION_STUCK',
  SECURITY = 'SECURITY',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  SYSTEM = 'SYSTEM',
}

export enum MaintenanceType {
  CORRECTIVE = 'CORRECTIVE',
  PREVENTIVE = 'PREVENTIVE',
  INSPECTION = 'INSPECTION',
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TelemetryType {
  ENERGY = 'ENERGY',
  POWER = 'POWER',
  VOLTAGE = 'VOLTAGE',
  CURRENT = 'CURRENT',
  TEMPERATURE = 'TEMPERATURE',
  STATUS = 'STATUS',
  ERROR = 'ERROR',
  HEARTBEAT = 'HEARTBEAT',
}
