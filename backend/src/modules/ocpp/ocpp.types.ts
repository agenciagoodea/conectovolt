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

// OCPP 1.6J Core profiles

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

export interface AuthorizePayload {
  idTag: string;
}

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

export interface MeterValuesPayload {
  connectorId: number;
  transactionId?: number;
  meterValue: Array<{
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

// Remote commands (server -> charger)

export interface RemoteStartTransactionPayload {
  connectorId?: number;
  idTag: string;
  chargingProfile?: any;
}

export interface RemoteStopTransactionPayload {
  transactionId: number;
}

export interface UnlockConnectorPayload {
  connectorId: number;
}

export interface ResetPayload {
  type: 'Hard' | 'Soft';
}

export interface ChangeConfigurationPayload {
  key: string;
  value: string;
}

export interface GetConfigurationPayload {
  key?: string[];
}

export interface TriggerMessagePayload {
  requestedMessage: string;
  connectorId?: number;
}

export interface ClearCachePayload {
  // Empty
}

export interface GetDiagnosticsPayload {
  location: string;
  retries?: number;
  retryInterval?: number;
  startTime?: string;
  stopTime?: string;
}

export interface UpdateFirmwarePayload {
  location: string;
  retries?: number;
  retrieveDate: string;
  retryInterval?: number;
}

export interface SendLocalListPayload {
  listVersion: number;
  updateType: 'Differential' | 'Full';
  localAuthorizationList?: Array<{
    idTag: string;
    idTagInfo?: { status: string; expiryDate?: string; parentIdTag?: string };
  }>;
}

export interface GetLocalListVersionPayload {
  // Empty
}

export interface ReserveNowPayload {
  connectorId: number;
  expiryDate: string;
  idTag: string;
  reservationId: number;
  parentIdTag?: string;
}

export interface CancelReservationPayload {
  reservationId: number;
}

export interface ChangeAvailabilityPayload {
  connectorId: number;
  type: 'Inoperative' | 'Operative';
}

export interface ClearChargingProfilePayload {
  id?: number;
  connectorId?: number;
  chargingProfilePurpose?: string;
  stackLevel?: number;
}

export interface SetChargingProfilePayload {
  connectorId: number;
  csChargingProfiles: any;
}

export type OcppAction =
  | 'BootNotification'
  | 'Heartbeat'
  | 'Authorize'
  | 'StatusNotification'
  | 'StartTransaction'
  | 'StopTransaction'
  | 'MeterValues'
  | 'DataTransfer'
  | 'DiagnosticsStatusNotification'
  | 'FirmwareStatusNotification'
  | 'RemoteStartTransaction'
  | 'RemoteStopTransaction'
  | 'UnlockConnector'
  | 'Reset'
  | 'ChangeConfiguration'
  | 'GetConfiguration'
  | 'TriggerMessage'
  | 'ClearCache'
  | 'GetDiagnostics'
  | 'UpdateFirmware'
  | 'SendLocalList'
  | 'GetLocalListVersion'
  | 'ReserveNow'
  | 'CancelReservation'
  | 'ChangeAvailability'
  | 'ClearChargingProfile'
  | 'SetChargingProfile';
