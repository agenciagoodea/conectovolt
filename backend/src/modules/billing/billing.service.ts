import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Plans
  async getPlans() {
    return this.prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
  }

  async createPlan(data: { name: string; description?: string; price: number; maxStations: number; maxChargers: number; maxUsers: number }) {
    return this.prisma.plan.create({ data });
  }

  async updatePlan(id: string, data: Partial<{ name: string; description: string; price: number; maxStations: number; maxChargers: number; maxUsers: number; isActive: boolean }>) {
    return this.prisma.plan.update({ where: { id }, data });
  }

  // Subscriptions
  async getSubscription(companyId: string) {
    return this.prisma.subscription.findUnique({
      where: { companyId },
      include: { plan: true },
    });
  }

  async subscribe(companyId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new BadRequestException('Plan not found');

    const existing = await this.prisma.subscription.findUnique({ where: { companyId } });
    if (existing) {
      return this.prisma.subscription.update({
        where: { companyId },
        data: { planId, status: 'ACTIVE', startDate: new Date() },
        include: { plan: true },
      });
    }

    return this.prisma.subscription.create({
      data: { companyId, planId, status: 'ACTIVE' },
      include: { plan: true },
    });
  }

  async cancelSubscription(companyId: string) {
    return this.prisma.subscription.update({
      where: { companyId },
      data: { status: 'CANCELLED', endDate: new Date() },
    });
  }

  // Limits
  async checkLimits(companyId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { companyId },
      include: { plan: true },
    });

    if (!sub?.plan) return { hasLimits: false, limits: null };

    const [stations, chargers, users] = await Promise.all([
      this.prisma.station.count({ where: { companyId } }),
      this.prisma.charger.count({ where: { station: { companyId } } }),
      this.prisma.user.count({ where: { companyId } }),
    ]);

    const plan = sub.plan;
    return {
      hasLimits: true,
      plan: { name: plan.name, price: plan.price },
      usage: { stations, chargers, users },
      limits: { maxStations: plan.maxStations, maxChargers: plan.maxChargers, maxUsers: plan.maxUsers },
      canCreateStation: stations < plan.maxStations,
      canCreateCharger: chargers < plan.maxChargers,
      canCreateUser: users < plan.maxUsers,
    };
  }

  // Usage tracking
  async trackUsage(companyId: string) {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [stations, chargers, sessions, stats] = await Promise.all([
      this.prisma.station.count({ where: { companyId } }),
      this.prisma.charger.count({ where: { station: { companyId } } }),
      this.prisma.chargingSession.count({
        where: { station: { companyId }, status: 'COMPLETED', startTime: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
      }),
      this.prisma.commission.aggregate({
        where: { companyId, createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
        _sum: { platformAmount: true, operatorAmount: true },
      }),
    ]);

    const existing = await this.prisma.platformUsage.findUnique({ where: { companyId_month: { companyId, month } } });

    if (existing) {
      await this.prisma.platformUsage.update({
        where: { companyId_month: { companyId, month } },
        data: { stations, chargers, sessions, revenue: (stats._sum.operatorAmount || 0) + (stats._sum.platformAmount || 0), commission: stats._sum.platformAmount || 0 },
      });
    } else {
      await this.prisma.platformUsage.create({
        data: { companyId, month, stations, chargers, sessions, revenue: (stats._sum.operatorAmount || 0) + (stats._sum.platformAmount || 0), commission: stats._sum.platformAmount || 0 },
      });
    }

    return { companyId, month, stations, chargers, sessions };
  }

  async getUsageHistory(companyId: string, months = 6) {
    return this.prisma.platformUsage.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: months,
    });
  }

  // Billing history for admin
  async getAllSubscriptions() {
    return this.prisma.subscription.findMany({
      include: { plan: true, company: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
