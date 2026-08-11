import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordEvent(data: {
    chargerId: string;
    sessionId?: string;
    type: string;
    measurand?: string;
    value: number;
    unit?: string;
    severity?: string;
    rawPayload?: string;
  }) {
    return this.prisma.telemetryEvent.create({
      data: {
        chargerId: data.chargerId,
        sessionId: data.sessionId,
        type: data.type,
        measurand: data.measurand,
        value: data.value,
        unit: data.unit,
        severity: data.severity,
        rawPayload: data.rawPayload,
      },
    });
  }

  async findByCharger(
    chargerId: string,
    options?: { type?: string; limit?: number; offset?: number },
  ) {
    const limit = options?.limit || 100;
    const offset = options?.offset || 0;

    const where: Record<string, unknown> = { chargerId };
    if (options?.type) where.type = options.type;

    const [events, total] = await Promise.all([
      this.prisma.telemetryEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.telemetryEvent.count({ where }),
    ]);

    return {
      data: events,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async findBySession(sessionId: string) {
    return this.prisma.telemetryEvent.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChargerSummary(chargerId: string, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const events = await this.prisma.telemetryEvent.findMany({
      where: {
        chargerId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalEnergy = events
      .filter((e) => e.type === 'ENERGY')
      .reduce((sum, e) => sum + e.value, 0);

    const errorCount = events.filter((e) => e.type === 'ERROR').length;
    const heartbeatCount = events.filter((e) => e.type === 'HEARTBEAT').length;

    return {
      chargerId,
      period: `${hours}h`,
      totalEvents: events.length,
      totalEnergy,
      errorCount,
      heartbeatCount,
      lastEvent: events[0] || null,
    };
  }

  async getStationAggregates(stationId: string, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const chargers = await this.prisma.charger.findMany({
      where: { stationId },
      select: { id: true, serialNumber: true, status: true },
    });

    const chargerIds = chargers.map((c) => c.id);

    const events = await this.prisma.telemetryEvent.findMany({
      where: {
        chargerId: { in: chargerIds },
        createdAt: { gte: since },
      },
    });

    const totalEnergy = events
      .filter((e) => e.type === 'ENERGY')
      .reduce((sum, e) => sum + e.value, 0);

    const totalErrors = events.filter((e) => e.type === 'ERROR').length;

    return {
      stationId,
      period: `${hours}h`,
      chargers: chargers.length,
      onlineChargers: chargers.filter((c) => c.status === 'ONLINE').length,
      totalEvents: events.length,
      totalEnergy,
      totalErrors,
    };
  }
}
