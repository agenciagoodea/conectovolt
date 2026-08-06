import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChargerDto, UpdateChargerDto, UpdateChargerStatusDto } from './dto/charger.dto';
import { OcppService } from '../ocpp/ocpp.service';

@Injectable()
export class ChargersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocppService: OcppService,
  ) {}

  async findAll(stationId?: string) {
    return this.prisma.charger.findMany({
      where: stationId ? { stationId } : undefined,
      include: { connectors: true, station: true },
    });
  }

  async findById(id: string) {
    return this.prisma.charger.findUnique({
      where: { id },
      include: { connectors: true, station: true },
    });
  }

  async create(dto: CreateChargerDto) {
    return this.prisma.charger.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateChargerDto) {
    return this.prisma.charger.update({ where: { id }, data: dto as any });
  }

  async updateStatus(id: string, dto: UpdateChargerStatusDto) {
    return this.prisma.charger.update({ where: { id }, data: { status: dto.status } });
  }

  async remove(id: string) {
    return this.prisma.charger.delete({ where: { id } });
  }

  async testConnection(id: string) {
    const charger = await this.prisma.charger.findUnique({ where: { id } });
    if (!charger || !charger.ocppId) {
      return { connected: false, ocppId: null, reason: 'Charger not found or no OCPP ID' };
    }

    const ws = this.ocppService.getConnection(charger.ocppId);

    if (!ws) {
      return {
        connected: false,
        ocppId: charger.ocppId,
        status: charger.status,
        reason: 'No active WebSocket connection',
      };
    }

    const readyState = ws.readyState;
    const readyStateLabels: Record<number, string> = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED',
    };

    return {
      connected: readyState === 1,
      ocppId: charger.ocppId,
      status: charger.status,
      wsReadyState: readyState,
      wsState: readyStateLabels[readyState] || 'UNKNOWN',
    };
  }

  async getConnectedChargers() {
    const connections = this.ocppService.connections;
    const connectedOcppIds = Array.from(connections.keys()).filter((ocppId) => {
      const ws = connections.get(ocppId);
      return ws && ws.readyState === 1;
    });

    const chargers = await this.prisma.charger.findMany({
      where: { ocppId: { in: connectedOcppIds } },
      select: { id: true, ocppId: true, serialNumber: true, model: true, status: true, station: { select: { name: true } } },
    });

    return chargers.map((c) => ({
      ...c,
      connected: true,
    }));
  }
}
