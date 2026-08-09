import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const [
      companies,
      stations,
      chargers,
      users,
      sessions,
      payments,
      commissions,
    ] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.station.count(),
      this.prisma.charger.count(),
      this.prisma.user.count(),
      this.prisma.chargingSession.count(),
      this.prisma.payment.count(),
      this.prisma.commission.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { percentage: true },
      }),
    ]);

    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    });

    const totalCommission = await this.prisma.commission.aggregate({
      _sum: { platformAmount: true },
    });

    return {
      stats: { companies, stations, chargers, users, sessions, payments },
      financial: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCommission: totalCommission._sum.platformAmount || 0,
        currentCommissionPercent: commissions?.percentage || 5,
      },
      gateway: { configured: !!process.env.MERCADO_PAGO_ACCESS_TOKEN },
    };
  }

  async updateSettings(body: { commissionPercent?: number }) {
    if (
      body.commissionPercent != null &&
      body.commissionPercent > 0 &&
      body.commissionPercent <= 100
    ) {
      const latest = await this.prisma.commission.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      if (latest) {
        await this.prisma.commission.upsert({
          where: { paymentId: latest.paymentId },
          update: { percentage: body.commissionPercent },
          create: {
            paymentId: latest.paymentId,
            companyId: latest.companyId,
            percentage: body.commissionPercent,
            platformAmount: 0,
            operatorAmount: 0,
          },
        });
      }
    }
    return this.getSettings();
  }
}
