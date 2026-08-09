import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { PrismaService } from '../../database/prisma.service';
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

  constructor(private readonly prisma: PrismaService) {}

  get connections() {
    return this.chargerConnections;
  }

  trackConnection(ocppId: string, ws: WebSocket) {
    this.chargerConnections.set(ocppId, ws);
    this.logger.log(`Charger connected: ${ocppId}`);
  }

  removeConnection(ocppId: string) {
    this.chargerConnections.delete(ocppId);
    this.logger.log(`Charger disconnected: ${ocppId}`);
  }

  getConnection(ocppId: string): WebSocket | undefined {
    return this.chargerConnections.get(ocppId);
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
      const defaultStation = await this.findOrCreateDefaultStation();
      await this.prisma.charger.create({
        data: {
          stationId: defaultStation.id,
          serialNumber: p.chargePointSerialNumber || `OCPP-${ocppId}`,
          model: p.chargePointModel || 'Unknown',
          manufacturer: p.chargePointVendor || 'Unknown',
          ocppId,
          status: 'ONLINE',
          powerKw: 0,
        },
      });
    }

    return {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 300,
    };
  }

  async handleHeartbeat(ocppId: string) {
    const charger = await this.prisma.charger.findUnique({ where: { ocppId } });
    if (charger) {
      await this.prisma.charger.update({
        where: { ocppId },
        data: { updatedAt: new Date() },
      });
    }
    return { currentTime: new Date().toISOString() };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  handleAuthorize(
    _ocppId: string,
    _payload: Record<string, unknown>,
  ): Record<string, unknown> {
    return { idTagInfo: { status: 'Accepted' } };
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

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

    await this.prisma.charger.update({
      where: { ocppId },
      data: { status: chargerStatusMap[p.status] ?? 'ONLINE' },
    });

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
          id: `${charger.id}-connector-${p.connectorId}`,
          chargerId: charger.id,
          type: 'TYPE2',
          status: status as 'AVAILABLE' | 'CHARGING' | 'FAULT' | 'UNAVAILABLE',
          powerKw: 0,
        },
      });
    }

    return {};
  }

  async handleMeterValues(ocppId: string, payload: Record<string, unknown>) {
    const p = payload as unknown as MeterValuesPayload;
    const charger = await this.prisma.charger.findUnique({ where: { ocppId } });
    if (!charger) return {};

    for (const mv of p.meterValue) {
      for (const sv of mv.sampledValue) {
        if (
          sv.measurand === 'Energy.Active.Import.Register' ||
          sv.measurand === 'Energy.Active.Import.Interval'
        ) {
          const energyKwh = parseFloat(sv.value) / 1000;
          const activeSession = await this.prisma.chargingSession.findFirst({
            where: { chargerId: charger.id, status: 'ACTIVE' },
            orderBy: { startTime: 'desc' },
          });
          if (activeSession) {
            await this.prisma.chargingSession.update({
              where: { id: activeSession.id },
              data: { energyKwh },
            });
          }
        }
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

    const connector = await this.prisma.connector.findFirst({
      where: { chargerId: charger.id },
    });

    const session = await this.prisma.chargingSession.create({
      data: {
        userId: p.idTag,
        chargerId: charger.id,
        connectorId: connector?.id,
        stationId: charger.stationId,
        status: 'ACTIVE',
        startTime: new Date(p.timestamp),
        energyKwh: p.meterStart / 1000,
        amount: 0,
      },
    });

    if (connector) {
      await this.prisma.connector.update({
        where: { id: connector.id },
        data: { status: 'CHARGING' },
      });
    }

    return { transactionId: session.id, idTagInfo: { status: 'Accepted' } };
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

    const session = await this.prisma.chargingSession.findFirst({
      where: { chargerId: charger.id, status: 'ACTIVE' },
      orderBy: { startTime: 'desc' },
    });
    if (!session) return { idTagInfo: { status: 'Invalid' } };

    const energyKwh = p.meterStop / 1000;
    const tariff = charger.station?.tariff;
    const pricePerKwh = tariff?.isActive ? Number(tariff.pricePerKwh) : 2.5;

    await this.prisma.chargingSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(p.timestamp),
        energyKwh,
        amount: energyKwh * pricePerKwh,
      },
    });

    if (session.connectorId) {
      await this.prisma.connector.update({
        where: { id: session.connectorId },
        data: { status: 'AVAILABLE' },
      });
    }

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

  private async findOrCreateDefaultStation() {
    let station = await this.prisma.station.findFirst({
      include: { company: true },
    });
    if (!station) {
      let company = await this.prisma.company.findFirst();
      if (!company) {
        company = await this.prisma.company.create({
          data: {
            name: 'Operadora OCPP',
            document: `OCPP-${Date.now()}`,
            status: 'ACTIVE',
          },
        });
        await this.prisma.wallet.create({
          data: { companyId: company.id, balance: 0 },
        });
      }
      station = await this.prisma.station.create({
        data: {
          companyId: company.id,
          name: 'Posto OCPP',
          address: 'Auto-registered via OCPP',
          city: 'Sao Paulo',
          state: 'SP',
          latitude: 0,
          longitude: 0,
          status: 'ACTIVE',
        },
        include: { company: true },
      });
    }
    return station;
  }
}
