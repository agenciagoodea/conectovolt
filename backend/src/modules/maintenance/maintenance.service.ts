import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    chargerId: string;
    companyId: string;
    title: string;
    description?: string;
    type?: string;
    priority?: string;
    scheduledAt?: string;
    assignedTo?: string;
    cost?: number;
  }) {
    const charger = await this.prisma.charger.findUnique({
      where: { id: data.chargerId },
    });
    if (!charger) throw new NotFoundException('Charger not found');

    return this.prisma.maintenanceRecord.create({
      data: {
        chargerId: data.chargerId,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        type: data.type || 'CORRECTIVE',
        priority: data.priority || 'MEDIUM',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        assignedTo: data.assignedTo,
        cost: data.cost || 0,
      },
      include: {
        charger: { select: { id: true, serialNumber: true, ocppId: true } },
      },
    });
  }

  async findAll(
    filters?: {
      companyId?: string;
      chargerId?: string;
      status?: string;
      priority?: string;
    },
    pagination?: { limit?: number; offset?: number },
  ) {
    const where: Record<string, unknown> = {};
    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.chargerId) where.chargerId = filters.chargerId;
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;

    const limit = pagination?.limit || 50;
    const offset = pagination?.offset || 0;

    const [records, total] = await Promise.all([
      this.prisma.maintenanceRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          charger: { select: { id: true, serialNumber: true, ocppId: true } },
          company: { select: { id: true, name: true } },
        },
      }),
      this.prisma.maintenanceRecord.count({ where }),
    ]);

    return {
      data: records,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async findById(id: string, companyId?: string) {
    const record = await this.prisma.maintenanceRecord.findUnique({
      where: { id },
      include: {
        charger: { select: { id: true, serialNumber: true, ocppId: true } },
        company: { select: { id: true, name: true } },
      },
    });

    if (!record) throw new NotFoundException('Maintenance record not found');
    if (companyId && record.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return record;
  }

  async updateStatus(
    id: string,
    status: string,
    companyId?: string,
  ) {
    const record = await this.findById(id, companyId);

    const updateData: Record<string, unknown> = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    return this.prisma.maintenanceRecord.update({
      where: { id },
      data: updateData,
      include: {
        charger: { select: { id: true, serialNumber: true, ocppId: true } },
      },
    });
  }

  async getUpcoming(companyId?: string) {
    const where: Record<string, unknown> = {
      status: { in: ['OPEN', 'IN_PROGRESS'] },
      scheduledAt: { gte: new Date() },
    };
    if (companyId) where.companyId = companyId;

    return this.prisma.maintenanceRecord.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: 10,
      include: {
        charger: { select: { id: true, serialNumber: true, ocppId: true } },
      },
    });
  }

  async getStats(companyId?: string) {
    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;

    const [open, inProgress, completed, total] = await Promise.all([
      this.prisma.maintenanceRecord.count({
        where: { ...where, status: 'OPEN' },
      }),
      this.prisma.maintenanceRecord.count({
        where: { ...where, status: 'IN_PROGRESS' },
      }),
      this.prisma.maintenanceRecord.count({
        where: { ...where, status: 'COMPLETED' },
      }),
      this.prisma.maintenanceRecord.count({ where }),
    ]);

    return { open, inProgress, completed, total };
  }
}
