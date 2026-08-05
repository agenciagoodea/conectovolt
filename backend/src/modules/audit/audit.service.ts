import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
          newValue: data.newValue ? JSON.stringify(data.newValue) : null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
    }
  }

  async getLogs(params: {
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.action) where.action = params.action;
    if (params.entity) where.entity = params.entity;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // Trigger notification on important events
  get notifications() {
    return {
      paymentApproved: (userId: string, amount: number) => ({
        userId,
        type: 'payment',
        title: 'Pagamento Aprovado',
        message: `Seu pagamento de R$ ${Number(amount).toFixed(2)} foi aprovado.`,
      }),
      chargingCompleted: (userId: string, energy: number, amount: number) => ({
        userId,
        type: 'charging',
        title: 'Recarga Concluida',
        message: `Recarga de ${Number(energy).toFixed(1)} kWh concluida. Total: R$ ${Number(amount).toFixed(2)}`,
      }),
      withdrawalRequested: (userId: string, amount: number) => ({
        userId,
        type: 'financial',
        title: 'Saque Solicitado',
        message: `Solicitacao de saque de R$ ${Number(amount).toFixed(2)} registrada.`,
      }),
      companyApproved: (userId: string, companyName: string) => ({
        userId,
        type: 'account',
        title: 'Empresa Aprovada',
        message: `Sua empresa "${companyName}" foi aprovada.`,
      }),
    };
  }
}
