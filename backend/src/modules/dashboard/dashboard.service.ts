import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOperatorDashboard(companyId: string) {
    const sessions = await this.prisma.chargingSession.findMany({
      where: { station: { companyId } },
      include: { payment: true },
    });

    const totalRevenue = sessions.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalEnergy = sessions.reduce((sum, s) => sum + Number(s.energyKwh), 0);
    const sessionsCount = sessions.length;

    const activeChargers = await this.prisma.charger.count({
      where: { station: { companyId }, status: 'ONLINE' },
    });

    const wallet = await this.prisma.wallet.findUnique({ where: { companyId } });

    return {
      revenue: totalRevenue,
      sessions: sessionsCount,
      energy: totalEnergy,
      activeChargers,
      balance: wallet?.balance || 0,
    };
  }

  async getOperatorChart(companyId: string) {
    return this.getMonthlyChart(companyId);
  }

  async getAdminDashboard() {
    const [totalRevenue, operators, stations, chargers, sessions] = await Promise.all([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'APPROVED' },
      }),
      this.prisma.company.count(),
      this.prisma.station.count({ where: { status: 'ACTIVE' } }),
      this.prisma.charger.count(),
      this.prisma.chargingSession.count(),
    ]);

    const totalCommission = await this.prisma.commission.aggregate({
      _sum: { platformAmount: true },
    });

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      commission: totalCommission._sum.platformAmount || 0,
      operators: operators,
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
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      months.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        start: d,
        end,
      });
    }

    const monthNames = months.map((m) => m.label);

    const stationFilter = companyId ? { station: { companyId } } : {};

    const revenueData: number[] = [];
    const sessionsData: number[] = [];
    const energyData: number[] = [];

    for (const m of months) {
      const sessions = await this.prisma.chargingSession.findMany({
        where: {
          ...stationFilter,
          startTime: { gte: m.start, lte: m.end },
          status: 'COMPLETED',
        },
      });

      revenueData.push(sessions.reduce((sum, s) => sum + Number(s.amount), 0));
      sessionsData.push(sessions.length);
      energyData.push(sessions.reduce((sum, s) => sum + Number(s.energyKwh), 0));
    }

    return {
      labels: monthNames,
      revenue: revenueData,
      sessions: sessionsData,
      energy: energyData,
    };
  }
}
