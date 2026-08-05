import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  BootNotificationPayload,
  StatusNotificationPayload,
  StartTransactionPayload,
  StopTransactionPayload,
} from './ocpp.types';

@Injectable()
export class OcppService {
  private readonly logger = new Logger(OcppService.name);

  private chargerConnections = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  trackConnection(ocppId: string, ws: any) {
    this.chargerConnections.set(ocppId, ws);
    this.logger.log(`Charger connected: ${ocppId}`);
  }

  removeConnection(ocppId: string) {
    this.chargerConnections.delete(ocppId);
    this.logger.log(`Charger disconnected: ${ocppId}`);
  }

  async handleBootNotification(ocppId: string, payload: BootNotificationPayload) {
    this.logger.log(
      `BootNotification from ${payload.chargePointVendor} ${payload.chargePointModel} (${ocppId})`,
    );

    const existing = await this.prisma.charger.findUnique({ where: { ocppId } });

    if (existing) {
      await this.prisma.charger.update({
        where: { ocppId },
        data: {
          model: payload.chargePointModel || existing.model,
          manufacturer: payload.chargePointVendor || existing.manufacturer,
          serialNumber: payload.chargePointSerialNumber || existing.serialNumber,
          status: 'ONLINE',
        },
      });
    } else {
      const defaultStation = await this.findOrCreateDefaultStation();
      await this.prisma.charger.create({
        data: {
          stationId: defaultStation.id,
          serialNumber: payload.chargePointSerialNumber || `OCPP-${ocppId}`,
          model: payload.chargePointModel || 'Unknown',
          manufacturer: payload.chargePointVendor || 'Unknown',
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

    return {
      currentTime: new Date().toISOString(),
    };
  }

  async handleStatusNotification(ocppId: string, payload: StatusNotificationPayload) {
    this.logger.log(`StatusNotification from ${ocppId} connector ${payload.connectorId}: ${payload.status}`);

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { connectors: true },
    });

    if (!charger) return {};

    const statusMap: Record<string, string> = {
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

    const chargerStatus = statusMap[payload.status] || 'ONLINE';
    await this.prisma.charger.update({
      where: { ocppId },
      data: { status: chargerStatus as any },
    });

    const connector = charger.connectors.find(
      (c) => c.id === `${charger.id}-connector-${payload.connectorId}`,
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

    const connectorStatus = connectorStatusMap[payload.status] || 'AVAILABLE';

    if (connector) {
      await this.prisma.connector.update({
        where: { id: connector.id },
        data: { status: connectorStatus as any },
      });
    } else {
      await this.prisma.connector.create({
        data: {
          id: `${charger.id}-connector-${payload.connectorId}`,
          chargerId: charger.id,
          type: 'TYPE2',
          status: connectorStatus as any,
          powerKw: 0,
        },
      });
    }

    return {};
  }

  async handleStartTransaction(ocppId: string, payload: StartTransactionPayload) {
    this.logger.log(`StartTransaction from ${ocppId} connector ${payload.connectorId}`);

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { station: true },
    });

    if (!charger) {
      return { transactionId: 0, idTagInfo: { status: 'Invalid' } };
    }

    const connector = await this.prisma.connector.findFirst({
      where: { chargerId: charger.id },
    });

    const session = await this.prisma.chargingSession.create({
      data: {
        userId: payload.idTag,
        chargerId: charger.id,
        connectorId: connector?.id,
        stationId: charger.stationId,
        status: 'ACTIVE',
        startTime: new Date(payload.timestamp),
        energyKwh: payload.meterStart / 1000,
        amount: 0,
      },
    });

    if (connector) {
      await this.prisma.connector.update({
        where: { id: connector.id },
        data: { status: 'CHARGING' },
      });
    }

    await this.prisma.charger.update({
      where: { ocppId },
      data: { status: 'ONLINE' },
    });

    return {
      transactionId: session.id,
      idTagInfo: { status: 'Accepted' },
    };
  }

  async handleStopTransaction(ocppId: string, payload: StopTransactionPayload) {
    this.logger.log(`StopTransaction from ${ocppId}: meterStop=${payload.meterStop}`);

    const charger = await this.prisma.charger.findUnique({
      where: { ocppId },
      include: { station: { include: { tariff: true } } },
    });

    if (!charger) {
      return { idTagInfo: { status: 'Invalid' } };
    }

    const session = await this.prisma.chargingSession.findFirst({
      where: { chargerId: charger.id, status: 'ACTIVE' },
      orderBy: { startTime: 'desc' },
    });

    if (!session) {
      return { idTagInfo: { status: 'Invalid' } };
    }

    const energyKwh = payload.meterStop / 1000;
    const tariff = charger.station?.tariff;
    const pricePerKwh = tariff?.isActive ? Number(tariff.pricePerKwh) : 2.50;
    const amount = energyKwh * pricePerKwh;

    await this.prisma.chargingSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(payload.timestamp),
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

    return { idTagInfo: { status: 'Accepted' } };
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
