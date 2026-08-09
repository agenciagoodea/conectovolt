import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getChargingReport(params: {
    startDate?: string;
    endDate?: string;
    companyId?: string;
  }) {
    const start = params.startDate ? new Date(params.startDate) : new Date(0);
    const end = params.endDate ? new Date(params.endDate) : new Date();

    const stationFilter = params.companyId
      ? { station: { companyId: params.companyId } }
      : {};

    const sessions = await this.prisma.chargingSession.findMany({
      where: {
        ...stationFilter,
        startTime: { gte: start, lte: end },
        status: 'COMPLETED',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        station: {
          select: { id: true, name: true, company: { select: { name: true } } },
        },
        charger: { select: { id: true, serialNumber: true } },
        payment: { select: { id: true, status: true, gateway: true } },
      },
      orderBy: { startTime: 'desc' },
    });

    const total = sessions.length;
    const totalEnergy = sessions.reduce((s, x) => s + Number(x.energyKwh), 0);
    const totalAmount = sessions.reduce((s, x) => s + Number(x.amount), 0);

    return {
      summary: { total, totalEnergy, totalAmount, period: { start, end } },
      sessions,
    };
  }

  async getFinancialReport(params: {
    startDate?: string;
    endDate?: string;
    companyId?: string;
  }) {
    const start = params.startDate ? new Date(params.startDate) : new Date(0);
    const end = params.endDate ? new Date(params.endDate) : new Date();

    const sessionFilter = params.companyId
      ? { session: { station: { companyId: params.companyId } } }
      : {};

    const payments = await this.prisma.payment.findMany({
      where: {
        ...sessionFilter,
        createdAt: { gte: start, lte: end },
        status: 'APPROVED',
      },
      include: {
        session: {
          include: {
            user: { select: { name: true } },
            station: {
              select: { name: true, company: { select: { name: true } } },
            },
          },
        },
        commission: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalGross = payments.reduce((s, x) => s + Number(x.amount), 0);
    const totalCommissions = payments.reduce(
      (s, x) => s + Number(x.commission?.platformAmount || 0),
      0,
    );
    const totalOperator = totalGross - totalCommissions;

    return {
      summary: {
        totalGross,
        totalCommissions,
        totalOperator,
        count: payments.length,
        period: { start, end },
      },
      payments,
    };
  }

  async getEnergyReport(params: {
    startDate?: string;
    endDate?: string;
    companyId?: string;
  }) {
    const start = params.startDate ? new Date(params.startDate) : new Date(0);
    const end = params.endDate ? new Date(params.endDate) : new Date();

    const stationFilter = params.companyId
      ? { station: { companyId: params.companyId } }
      : {};

    const sessions = await this.prisma.chargingSession.findMany({
      where: {
        ...stationFilter,
        startTime: { gte: start, lte: end },
        status: 'COMPLETED',
      },
      select: {
        id: true,
        energyKwh: true,
        startTime: true,
        station: { select: { name: true } },
      },
      orderBy: { startTime: 'desc' },
    });

    const totalEnergy = sessions.reduce((s, x) => s + Number(x.energyKwh), 0);

    const monthly: { label: string; energy: number; sessions: number }[] = [];
    const grouped = new Map<string, { energy: number; sessions: number }>();
    for (const s of sessions) {
      const key = s.startTime.toISOString().slice(0, 7);
      const entry = grouped.get(key) || { energy: 0, sessions: 0 };
      entry.energy += Number(s.energyKwh);
      entry.sessions++;
      grouped.set(key, entry);
    }
    for (const [label, data] of grouped) {
      monthly.push({ label, energy: data.energy, sessions: data.sessions });
    }

    return {
      summary: {
        totalEnergy,
        totalSessions: sessions.length,
        period: { start, end },
      },
      monthly,
    };
  }

  async getEquipmentReport(params: { companyId?: string }) {
    const stationFilter = params.companyId
      ? { station: { companyId: params.companyId } }
      : {};

    const chargers = await this.prisma.charger.findMany({
      where: stationFilter,
      include: {
        connectors: true,
        station: { select: { id: true, name: true } },
        _count: { select: { chargingSessions: true } },
      },
    });

    const total = chargers.length;
    const online = chargers.filter((c) => c.status === 'ONLINE').length;
    const offline = chargers.filter((c) => c.status === 'OFFLINE').length;
    const error = chargers.filter((c) => c.status === 'ERROR').length;
    const totalConnectors = chargers.reduce(
      (s, c) => s + c.connectors.length,
      0,
    );

    return {
      summary: { total, online, offline, error, totalConnectors },
      chargers,
    };
  }

  // CSV/Excel export helpers
  generateCsv(headers: string[], rows: string[][]): string {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    return [
      headers.map(escape).join(','),
      ...rows.map((r) => r.map(escape).join(',')),
    ].join('\n');
  }
}
