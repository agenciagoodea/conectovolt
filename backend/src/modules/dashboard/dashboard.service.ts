import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOperatorDashboard(companyId: string) {
    const stationFilter = { station: { companyId } };

    const [revenue, sessionsCount, energy, activeChargers, wallet] =
      await Promise.all([
        this.prisma.chargingSession.aggregate({
          _sum: { amount: true },
          where: { ...stationFilter, status: 'COMPLETED' },
        }),
        this.prisma.chargingSession.count({
          where: { ...stationFilter, status: 'COMPLETED' },
        }),
        this.prisma.chargingSession.aggregate({
          _sum: { energyKwh: true },
          where: { ...stationFilter, status: 'COMPLETED' },
        }),
        this.prisma.charger.count({
          where: { station: { companyId }, status: 'ONLINE' },
        }),
        this.prisma.wallet.findUnique({ where: { companyId } }),
      ]);

    return {
      revenue: revenue._sum.amount || 0,
      sessions: sessionsCount,
      energy: energy._sum.energyKwh || 0,
      activeChargers,
      balance: wallet?.balance || 0,
    };
  }

  async getOperatorChart(companyId: string) {
    return this.getMonthlyChart(companyId);
  }

  async getAdminDashboard() {
    const [
      totalRevenue,
      totalCommission,
      operators,
      stations,
      chargers,
      sessions,
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'APPROVED' },
      }),
      this.prisma.commission.aggregate({
        _sum: { platformAmount: true },
      }),
      this.prisma.company.count(),
      this.prisma.station.count({ where: { status: 'ACTIVE' } }),
      this.prisma.charger.count(),
      this.prisma.chargingSession.count(),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      commission: totalCommission._sum.platformAmount || 0,
      operators,
      activeStations: stations,
      totalChargers: chargers,
      totalSessions: sessions,
    };
  }

  async getAdminChart() {
    return this.getMonthlyChart();
  }

  private async getMonthlyChart(companyId?: string) {
    const now = new Date();
    const months: { label: string; start: Date; end: Date }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
      );
      months.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        start: d,
        end,
      });
    }

    const monthNames = months.map((m) => m.label);
    const stationFilter = companyId ? { station: { companyId } } : {};

    const queries = months.map((m) =>
      this.prisma.chargingSession.aggregate({
        _sum: { amount: true, energyKwh: true },
        _count: true,
        where: {
          ...stationFilter,
          startTime: { gte: m.start, lte: m.end },
          status: 'COMPLETED',
        },
      }),
    );

    const results = await Promise.all(queries);

    return {
      labels: monthNames,
      revenue: results.map((r) => r._sum.amount || 0),
      sessions: results.map((r) => r._count),
      energy: results.map((r) => r._sum.energyKwh || 0),
    };
  }
}
