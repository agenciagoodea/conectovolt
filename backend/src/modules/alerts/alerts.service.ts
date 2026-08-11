import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    companyId?: string;
    chargerId?: string;
    stationId?: string;
    type: string;
    severity: string;
    title: string;
    message: string;
  }) {
    const alert = await this.prisma.alert.create({ data });

    this.logger.log(
      `Alert created: [${data.severity}] ${data.title} (${data.type})`,
    );

    return alert;
  }

  async findAll(
    filters?: {
      companyId?: string;
      severity?: string;
      resolved?: boolean;
      chargerId?: string;
      stationId?: string;
    },
    pagination?: { limit?: number; offset?: number },
  ) {
    const where: Record<string, unknown> = {};
    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.resolved !== undefined) where.resolved = filters.resolved;
    if (filters?.chargerId) where.chargerId = filters.chargerId;
    if (filters?.stationId) where.stationId = filters.stationId;

    const limit = pagination?.limit || 50;
    const offset = pagination?.offset || 0;

    const [alerts, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          company: { select: { id: true, name: true } },
          charger: { select: { id: true, serialNumber: true, ocppId: true } },
          station: { select: { id: true, name: true } },
        },
      }),
      this.prisma.alert.count({ where }),
    ]);

    return {
      data: alerts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async resolve(
    id: string,
    resolvedBy: string,
  ) {
    return this.prisma.alert.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy,
      },
    });
  }

  async getUnresolvedCount(companyId?: string) {
    const where: Record<string, unknown> = { resolved: false };
    if (companyId) where.companyId = companyId;
    return this.prisma.alert.count({ where });
  }

  async getSeverityCounts(companyId?: string) {
    const where: Record<string, unknown> = { resolved: false };
    if (companyId) where.companyId = companyId;

    const [info, warning, error, critical] = await Promise.all([
      this.prisma.alert.count({ where: { ...where, severity: 'INFO' } }),
      this.prisma.alert.count({ where: { ...where, severity: 'WARNING' } }),
      this.prisma.alert.count({ where: { ...where, severity: 'ERROR' } }),
      this.prisma.alert.count({ where: { ...where, severity: 'CRITICAL' } }),
    ]);

    return { INFO: info, WARNING: warning, ERROR: error, CRITICAL: critical };
  }

  async createChargerOfflineAlert(
    chargerId: string,
    companyId: string,
    stationId: string,
    ocppId: string,
  ) {
    return this.create({
      companyId,
      chargerId,
      stationId,
      type: 'CHARGER_OFFLINE',
      severity: 'WARNING',
      title: `Carregador offline: ${ocppId}`,
      message: `O carregador ${ocppId} está sem comunicação. Último heartbeat pode ter expirado.`,
    });
  }

  async createChargerFaultAlert(
    chargerId: string,
    companyId: string,
    stationId: string,
    ocppId: string,
    details: string,
  ) {
    return this.create({
      companyId,
      chargerId,
      stationId,
      type: 'CHARGER_FAULT',
      severity: 'ERROR',
      title: `Falha no carregador: ${ocppId}`,
      message: `O carregador ${ocppId} reportou uma falha: ${details}`,
    });
  }

  async createSessionStuckAlert(
    sessionId: string,
    chargerId: string,
    companyId: string,
    stationId: string,
  ) {
    return this.create({
      companyId,
      chargerId,
      stationId,
      type: 'SESSION_STUCK',
      severity: 'WARNING',
      title: `Sessão travada: ${sessionId}`,
      message: `A sessão ${sessionId} está ativa há mais de 12 horas sem atualização.`,
    });
  }
}
