export interface OcppCall {
  messageTypeId: 2;
  uniqueId: string;
  action: string;
  payload: Record<string, any>;
}

export interface OcppCallResult {
  messageTypeId: 3;
  uniqueId: string;
  payload: Record<string, any>;
}

export interface OcppCallError {
  messageTypeId: 4;
  uniqueId: string;
  errorCode: string;
  errorDescription: string;
  errorDetails: Record<string, any>;
}

export type OcppMessage = OcppCall | OcppCallResult | OcppCallError;

export interface BootNotificationPayload {
  chargePointModel: string;
  chargePointVendor: string;
  chargePointSerialNumber?: string;
  chargeBoxSerialNumber?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  meterSerialNumber?: string;
  meterType?: string;
}

export interface HeartbeatPayload {}

export interface StatusNotificationPayload {
  connectorId: number;
  errorCode: string;
  info?: string;
  status: string;
  timestamp?: string;
  vendorId?: string;
  vendorErrorCode?: string;
}

export interface StartTransactionPayload {
  connectorId: number;
  idTag: string;
  meterStart: number;
  reservationId?: number;
  timestamp: string;
}

export interface StopTransactionPayload {
  idTag?: string;
  meterStop: number;
  timestamp: string;
  transactionId: number;
  reason?: string;
  transactionData?: Array<{
    timestamp: string;
    sampledValue: Array<{
      value: string;
      context?: string;
      format?: string;
      measurand?: string;
      phase?: string;
      location?: string;
      unit?: string;
    }>;
  }>;
}

export type OcppAction =
  | 'BootNotification'
  | 'Heartbeat'
  | 'StatusNotification'
  | 'StartTransaction'
  | 'StopTransaction'
  | 'Authorize'
  | 'MeterValues'
  | 'DataTransfer'
  | 'DiagnosticsStatusNotification'
  | 'FirmwareStatusNotification';
