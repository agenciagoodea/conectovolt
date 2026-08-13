import { Injectable, Logger, Inject, Optional, forwardRef } from '@nestjs/common';
import WebSocket from 'ws';
import { PrismaService } from '../../database/prisma.service';
import { ChargingGateway } from '../charging/gateways/charging.gateway';
import {
  BootNotificationPayload,
  StatusNotificationPayload,
  StartTransactionPayload,
  StopTransactionPayload,
  MeterValuesPayload,
} from './ocpp.types';

@Injectable()
export class OcppService {
  private readonly logger = new Logger(OcppService.name);

  private chargerConnections = new Map<string, WebSocket>();
  private chargerConfigs = new Map<string, Map<string, string>>();
  private transactionSessions = new Map<number, string>();
  private transactionMeterStarts = new Map<number, number>();
  private heartbeatTimestamps = new Map<string, Date>();
  private connectorTelemetry = new Map<string, {
    powerKw: number;
    energyKwh: number;
    voltage: number;
    current: number;
    frequency: number;
    timestamp: number;
  }>();
  private heartbeatCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(forwardRef(() => ChargingGateway))
    private readonly chargingGateway?: ChargingGateway,
  ) {
    this.startHeartbeatCheck();
  }

  private startHeartbeatCheck() {
    this.heartbeatCheckInterval = setInterval(async () => {
      const timeoutMs = 5 * 60 * 1000;
      const now = Date.now();

      for (const [ocppId, lastHeartbeat] of this.heartbeatTimestamps) {
        if (now - lastHeartbeat.getTime() > timeoutMs) {
          const charger = await this.prisma.charger.findUnique({
            where: { ocppId },
            include: { station: { select: { companyId: true, id: true } } },
          });

          if (charger && charger.status === 'ONLINE') {
            await this.prisma.charger.update({
              where: { ocppId },
              data: { status: 'OFFLINE' },
            });

            this.logger.warn(
              `Charger ${ocppId} marked OFFLINE - heartbeat timeout`,
            );

            this.chargingGateway?.emitChargerStatusUpdate(
              charger.id,
              'OFFLINE',
            );

            this.heartbeatTimestamps.delete(ocppId);
          }
        }
      }
    }, 60000);
  }

  onModuleDestroy() {
    if (this.heartbeatCheckInterval) {
      clearInterval(this.heartbeatCheckInterval);
    }
  }

  get connections() {
    return this.chargerConnections;
  }

  async broadcastChargerStatus(ocppId: string, status: string) {
    try {
      const charger = await this.prisma.charger.findUnique({
        where: { ocppId },
        select: { id: true },
      });
      if (charger && this.chargingGateway) {
        this.chargingGateway.emitChargerStatusUpdate(charger.id, status);
      }
    } catch {
      /* ignore */
    }
  }

  async trackConnection(ocppId: string, ws: WebSocket) {
    this.chargerConnections.set(ocppId, ws);
    this.heartbeatTimestamps.set(ocppId, new Date());
    this.logger.log(`Charger connected: ${ocppId}`);

    try {
      const charger = await this.prisma.charger.findUnique({
        where: { ocppId },
        select: { id: true, status: true },
      });
      if (charger) {
        if (charger.status !== 'ONLINE') {
          await this.prisma.charger.update({
            where: { ocppId },
            data: { status: 'ONLINE' },
          });
        }
        this.chargingGateway?.emitChargerStatusUpdate(charger.id, 'ONLINE');
      }
    } catch {
      /* ignore */
    }
  }

  async removeConnection(ocppId: string) {
    this.chargerConnections.delete(ocppId);
    this.heartbeatTimestamps.delete(ocppId);
    this.logger.log(`Charger disconnected: ${ocppId}`);

    try {
      const charger = await this.prisma.charger.findUnique({
        where: { ocppId },
        select: { id: true, status: true },
      });
      if (charger) {
        if (charger.status !== 'OFFLINE') {
          await this.prisma.charger.update({
            where: { ocppId },
            data: { status: 'OFFLINE' },
          });
        }
        this.chargingGateway?.emitChargerStatusUpdate(charger.id, 'OFFLINE');
      }
    } catch {
      /* ignore */
    }
  }

  getConnection(ocppId: string): WebSocket | undefined {
    return this.chargerConnections.get(ocppId);
  }

  getConnectorTelemetry(connectorId: string) {
    return this.connectorTelemetry.get(connectorId) || null;
  }

  getAllConnectorTelemetry() {
    const result: Record<string, ReturnType<typeof this.getConnectorTelemetry>> = {};
    for (const [k, v] of this.connectorTelemetry) {
      result[k] = v;
    }
    return result;
  }

  async handleBootNotification(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const p = payload as unknown as BootNotificationPayload;
    this.logger.log(
      `BootNotification from ${p.chargePointVendor} ${p.chargePointModel} (${ocppId})`,
    );

    const existing = await this.prisma.charger.findUnique({
      where: { ocppId },
    });

    if (existing) {
      await this.prisma.charger.update({
        where: { ocppId },
        data: {
          model: p.chargePointModel || existing.model,
          manufacturer: p.chargePointVendor || existing.manufacturer,
          serialNumber: p.chargePointSerialNumber || existing.serialNumber,
          status: 'ONLINE',
        },
      });
    } else {
      this.logger.warn(
        `Unknown charger rejected during BootNotification: ${ocppId}`,
      );
      return {
        status: 'Rejected',
        currentTime: new Date().toISOString(),
        interval: 300,
      };
    }

    return {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 300,
    };
  }

  async handleHeartbeat(ocppId: string) {
    this.heartbeatTimestamps.set(ocppId, new Date());
    const charger = await this.prisma.charger.findUnique({ where: { ocppId } });
    if (charger) {
      await this.prisma.charger.update({
        where: { ocppId },
        data: { updatedAt: new Date() },
      });
    }
    return { currentTime: new Date().toISOString() };
  }

  async handleAuthorize(
    _ocppId: string,
    payload: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const idTag = typeof payload.idTag === 'string' ? payload.idTag : '';
    const user = idTag
      ? await this.prisma.user.findUnique({ where: { id: idTag } })
      : null;

    return { idTagInfo: { status: user ? 'Accepted' : 'Invalid' } };
  }

  async handleStatusNotification(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const p = payload as unknown as StatusNotificationPayload;
    this.logger.log(
      `StatusNotification from ${ocppId} connector ${p.connectorId}: ${p.status}`,
    );

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { connectors: true },
    });
    if (!charger) return {};

    const chargerStatusMap: Record<string, string> = {
      Available: 'ONLINE',
      Preparing: 'ONLINE',
      Charging: 'ONLINE',
      SuspendedEVSE: 'ONLINE',
      SuspendedEV: 'ONLINE',
      Finishing: 'ONLINE',
      Reserved: 'ONLINE',
      Unavailable: 'OFFLINE',
      Faulted: 'ERROR',
    };

    const newChargerStatus = chargerStatusMap[p.status] ?? 'ONLINE';
    await this.prisma.charger.update({
      where: { ocppId },
      data: { status: newChargerStatus },
    });
    this.chargingGateway?.emitChargerStatusUpdate(charger.id, newChargerStatus);

    const connector = charger.connectors.find(
      (c) => c.id === `${charger.id}-connector-${p.connectorId}`,
    );

    const connectorStatusMap: Record<string, string> = {
      Available: 'AVAILABLE',
      Preparing: 'CHARGING',
      Charging: 'CHARGING',
      SuspendedEVSE: 'CHARGING',
      SuspendedEV: 'CHARGING',
      Finishing: 'CHARGING',
      Reserved: 'UNAVAILABLE',
      Unavailable: 'UNAVAILABLE',
      Faulted: 'FAULT',
    };

    const status = connectorStatusMap[p.status] ?? 'AVAILABLE';
    const connectorId = connector?.id || `${charger.id}-connector-${p.connectorId}`;

    if (connector) {
      await this.prisma.connector.update({
        where: { id: connector.id },
        data: {
          status: status as 'AVAILABLE' | 'CHARGING' | 'FAULT' | 'UNAVAILABLE',
        },
      });
    } else {
      await this.prisma.connector.create({
        data: {
          id: connectorId,
          chargerId: charger.id,
          type: 'TYPE2',
          status: status as 'AVAILABLE' | 'CHARGING' | 'FAULT' | 'UNAVAILABLE',
          powerKw: 0,
        },
      });
    }

    this.chargingGateway?.emitConnectorStatusUpdate(charger.id, connectorId, status);

    return {};
  }

  async handleMeterValues(ocppId: string, payload: Record<string, unknown>) {
    const p = payload as unknown as MeterValuesPayload;
    const charger = await this.prisma.charger.findUnique({ where: { ocppId } });
    if (!charger) return {};

    const connectorId = `${charger.id}-connector-${p.connectorId}`;
    let powerKw = 0;
    let energyKwh = 0;
    let voltage = 0;
    let current = 0;
    let frequency = 0;

    for (const mv of p.meterValue) {
      for (const sv of mv.sampledValue) {
        const val = parseFloat(sv.value);
        switch (sv.measurand) {
          case 'Power.Active.Import':
            powerKw = sv.unit === 'W' ? val / 1000 : val;
            break;
          case 'Energy.Active.Import.Register':
          case 'Energy.Active.Import.Interval':
            energyKwh = sv.unit === 'kWh' ? val : val / 1000;
            break;
          case 'Voltage':
            voltage = val;
            break;
          case 'Current.Import':
            current = val;
            break;
          case 'Frequency':
            frequency = val;
            break;
        }
      }
    }

    const now = Date.now();
    this.connectorTelemetry.set(connectorId, {
      powerKw, energyKwh, voltage, current, frequency, timestamp: now,
    });

    this.chargingGateway?.emitConnectorTelemetry(charger.id, connectorId, {
      powerKw, energyKwh, voltage, current, frequency, timestamp: now,
    });

    if (energyKwh > 0) {
      const activeSession = await this.prisma.chargingSession.findFirst({
        where: { chargerId: charger.id, status: 'ACTIVE' },
        orderBy: { startTime: 'desc' },
      });
      if (activeSession) {
        const newEnergy = Math.max(Number(activeSession.energyKwh), energyKwh);

        const station = await this.prisma.station.findUnique({
          where: { id: activeSession.stationId },
          include: { tariff: true },
        });
        const pricePerKwh = station?.tariff?.isActive
          ? Number(station.tariff.pricePerKwh)
          : 2.5;
        const currentAmount = newEnergy * pricePerKwh;

        await this.prisma.chargingSession.update({
          where: { id: activeSession.id },
          data: { energyKwh: newEnergy, amount: currentAmount },
        });

        this.chargingGateway?.emitSessionUpdate({
          sessionId: activeSession.id,
          userId: activeSession.userId,
          chargerId: charger.id,
          status: 'ACTIVE',
          energyKwh: newEnergy,
          amount: currentAmount,
          startTime: activeSession.startTime,
        });
      }
    }

    return {};
  }

  async handleStartTransaction(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const p = payload as unknown as StartTransactionPayload;
    this.logger.log(
      `StartTransaction from ${ocppId} connector ${p.connectorId}`,
    );

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { station: true },
    });
    if (!charger) return { transactionId: 0, idTagInfo: { status: 'Invalid' } };

    const user = await this.prisma.user.findUnique({
      where: { id: p.idTag },
    });
    if (!user) {
      return { transactionId: 0, idTagInfo: { status: 'Invalid' } };
    }

    const connectorId = `${charger.id}-connector-${p.connectorId}`;
    const connector =
      (await this.prisma.connector.findUnique({
        where: { id: connectorId },
      })) ||
      (await this.prisma.connector.findFirst({
        where: { chargerId: charger.id },
      }));

    const existingSession = await this.prisma.chargingSession.findFirst({
      where: { chargerId: charger.id, status: 'ACTIVE' },
      orderBy: { startTime: 'desc' },
    });

    let session;
    if (existingSession) {
      session = existingSession;
      this.logger.log(
        `Reusing existing active session ${session.id} for charger ${charger.id}`,
      );
    } else {
      session = await this.prisma.chargingSession.create({
        data: {
          userId: user.id,
          chargerId: charger.id,
          connectorId: connector?.id,
          stationId: charger.stationId,
          status: 'ACTIVE',
          startTime: new Date(p.timestamp),
          energyKwh: 0,
          amount: 0,
        },
      });
    }

    if (connector) {
      await this.prisma.connector.update({
        where: { id: connector.id },
        data: { status: 'CHARGING' },
      });
    }

    const transactionId = Date.now();
    this.transactionSessions.set(transactionId, session.id);
    this.transactionMeterStarts.set(transactionId, p.meterStart);

    this.chargingGateway?.emitSessionStarted({
      sessionId: session.id,
      userId: user.id,
      chargerId: charger.id,
      status: 'ACTIVE',
      energyKwh: 0,
      amount: 0,
      startTime: session.startTime,
    });

    return { transactionId, idTagInfo: { status: 'Accepted' } };
  }

  async handleStopTransaction(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const p = payload as unknown as StopTransactionPayload;
    this.logger.log(`StopTransaction from ${ocppId}: meterStop=${p.meterStop}`);

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { station: { include: { tariff: true } } },
    });
    if (!charger) return { idTagInfo: { status: 'Invalid' } };

    const mappedSessionId = this.transactionSessions.get(p.transactionId);
    const session = mappedSessionId
      ? await this.prisma.chargingSession.findUnique({
          where: { id: mappedSessionId },
        })
      : await this.prisma.chargingSession.findFirst({
          where: { chargerId: charger.id, status: 'ACTIVE' },
          orderBy: { startTime: 'desc' },
        });
    if (!session) return { idTagInfo: { status: 'Invalid' } };

    if (session.status === 'COMPLETED') {
      this.logger.log(`Session ${session.id} already completed, ignoring duplicate StopTransaction`);
      this.transactionSessions.delete(p.transactionId);
      this.transactionMeterStarts.delete(p.transactionId);
      return { idTagInfo: { status: 'Accepted' } };
    }

    const meterStart = this.transactionMeterStarts.get(p.transactionId) || 0;
    const energyKwh = Math.max(0, (p.meterStop - meterStart) / 1000);
    const tariff = charger.station?.tariff;
    const pricePerKwh = tariff?.isActive ? Number(tariff.pricePerKwh) : 2.5;

    const amount = energyKwh * pricePerKwh;
    await this.prisma.chargingSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(p.timestamp),
        energyKwh,
        amount,
      },
    });

    if (session.connectorId) {
      await this.prisma.connector.update({
        where: { id: session.connectorId },
        data: { status: 'AVAILABLE' },
      });
    }

    this.chargingGateway?.emitSessionCompleted({
      sessionId: session.id,
      userId: session.userId,
      chargerId: charger.id,
      status: 'COMPLETED',
      energyKwh,
      amount,
      startTime: session.startTime,
      endTime: new Date(p.timestamp),
    });

    this.transactionSessions.delete(p.transactionId);
    this.transactionMeterStarts.delete(p.transactionId);

    return { idTagInfo: { status: 'Accepted' } };
  }

  handleDataTransfer(ocppId: string, payload: Record<string, unknown>) {
    const vendorId =
      typeof payload.vendorId === 'string' ? payload.vendorId : '';
    const messageId =
      typeof payload.messageId === 'string' ? payload.messageId : '';
    this.logger.log(`DataTransfer from ${ocppId}: ${vendorId}/${messageId}`);
    return { status: 'Accepted' };
  }

  handleDiagnosticsStatusNotification(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const status = typeof payload.status === 'string' ? payload.status : '';
    this.logger.log(`DiagnosticsStatusNotification from ${ocppId}: ${status}`);
    return {};
  }

  handleFirmwareStatusNotification(
    ocppId: string,
    payload: Record<string, unknown>,
  ) {
    const status = typeof payload.status === 'string' ? payload.status : '';
    this.logger.log(`FirmwareStatusNotification from ${ocppId}: ${status}`);
    return {};
  }

  handleGetConfiguration(ocppId: string, payload: Record<string, unknown>) {
    const configs =
      this.chargerConfigs.get(ocppId) ?? new Map<string, string>();
    const keys: string[] = Array.isArray(payload.key)
      ? payload.key.filter((k): k is string => typeof k === 'string')
      : Array.from(configs.keys());
    const configurationKey = keys.map((k) => ({
      key: k,
      readonly: false,
      value: configs.get(k) ?? '',
    }));
    return { configurationKey, unknownKey: [] };
  }

  handleChangeConfiguration(ocppId: string, payload: Record<string, unknown>) {
    const key = typeof payload.key === 'string' ? payload.key : '';
    const value = typeof payload.value === 'string' ? payload.value : '';
    this.logger.log(`ChangeConfiguration from ${ocppId}: ${key}=${value}`);
    let configs = this.chargerConfigs.get(ocppId);
    if (!configs) {
      configs = new Map();
      this.chargerConfigs.set(ocppId, configs);
    }
    configs.set(key, value);
    return { status: 'Accepted' };
  }

  sendRemoteStartTransaction(
    ocppId: string,
    idTag: string,
    connectorId?: number,
  ): boolean {
    const ws = this.chargerConnections.get(ocppId);
    if (!ws || ws.readyState !== 1) {
      this.logger.warn(
        `Cannot send RemoteStartTransaction: charger ${ocppId} not connected`,
      );
      return false;
    }
    const uniqueId = `RemoteStartTransaction-${Date.now()}`;
    const message = [2, uniqueId, 'RemoteStartTransaction', { connectorId, idTag }];
    ws.send(JSON.stringify(message));
    this.logger.log(`Sent RemoteStartTransaction to ${ocppId} (connector ${connectorId})`);
    return true;
  }

  sendRemoteStopTransaction(ocppId: string, transactionId: number): boolean {
    const ws = this.chargerConnections.get(ocppId);
    if (!ws || ws.readyState !== 1) {
      this.logger.warn(
        `Cannot send RemoteStopTransaction: charger ${ocppId} not connected`,
      );
      return false;
    }
    const uniqueId = `RemoteStopTransaction-${Date.now()}`;
    const message = [2, uniqueId, 'RemoteStopTransaction', { transactionId }];
    ws.send(JSON.stringify(message));
    this.logger.log(`Sent RemoteStopTransaction to ${ocppId} (tx ${transactionId})`);
    return true;
  }

  getTransactionIdForSession(sessionId: string): number | null {
    for (const [txId, sessId] of this.transactionSessions) {
      if (sessId === sessionId) return txId;
    }
    return null;
  }
}
