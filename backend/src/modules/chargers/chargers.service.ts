import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateChargerDto,
  UpdateChargerDto,
  UpdateChargerStatusDto,
} from './dto/charger.dto';
import { OcppService } from '../ocpp/ocpp.service';

@Injectable()
export class ChargersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocppService: OcppService,
  ) {}

  private async assertCompanyAccess(
    chargerId: string,
    user?: { role: string; companyId?: string },
  ) {
    const charger = await this.prisma.charger.findUnique({
      where: { id: chargerId },
      include: { station: true },
    });

    if (!charger) {
      throw new NotFoundException('Charger not found');
    }

    if (user?.role === 'OPERATOR') {
      if (!user.companyId || charger.station?.companyId !== user.companyId) {
        throw new ForbiddenException('You do not have access to this charger');
      }
    }

    return charger;
  }

  async findAll(
    stationId?: string,
    user?: { role: string; companyId?: string },
  ) {
    const where: { stationId?: string; station?: { companyId: string } } = {};
    if (stationId) where.stationId = stationId;
    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      where.station = { companyId: user.companyId };
    }

    return this.prisma.charger.findMany({
      where,
      include: { connectors: true, station: true },
    });
  }

  async findById(id: string, user?: { role: string; companyId?: string }) {
    return this.assertCompanyAccess(id, user);
  }

  async create(
    dto: CreateChargerDto,
    user?: { role: string; companyId?: string },
  ) {
    const station = await this.prisma.station.findUnique({
      where: { id: dto.stationId },
    });

    if (!station) {
      throw new NotFoundException('Station not found');
    }

    if (user?.role === 'OPERATOR') {
      if (!user.companyId || station.companyId !== user.companyId) {
        throw new ForbiddenException('You do not have access to this station');
      }
    }

    return this.prisma.charger.create({ data: dto });
  }

  async update(
    id: string,
    dto: UpdateChargerDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.assertCompanyAccess(id, user);

    if (dto.stationId) {
      const station = await this.prisma.station.findUnique({
        where: { id: dto.stationId },
      });
      if (!station) {
        throw new NotFoundException('Station not found');
      }
      if (user?.role === 'OPERATOR' && station.companyId !== user.companyId) {
        throw new ForbiddenException('You do not have access to this station');
      }
    }

    return this.prisma.charger.update({ where: { id }, data: dto });
  }

  async updateStatus(
    id: string,
    dto: UpdateChargerStatusDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.assertCompanyAccess(id, user);
    return this.prisma.charger.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string, user?: { role: string; companyId?: string }) {
    await this.assertCompanyAccess(id, user);
    return this.prisma.charger.delete({ where: { id } });
  }

  async bulkDelete(ids: string[], user?: { role: string; companyId?: string }) {
    if (!ids || ids.length === 0) return { deleted: 0 };
    let validIds = ids;
    if (user?.role === 'OPERATOR') {
      const chargers = await this.prisma.charger.findMany({
        where: { id: { in: ids }, station: { companyId: user.companyId } },
        select: { id: true },
      });
      validIds = chargers.map((c) => c.id);
    }
    if (validIds.length === 0) return { deleted: 0 };

    await this.prisma.connector.deleteMany({
      where: { chargerId: { in: validIds } },
    });

    const res = await this.prisma.charger.deleteMany({
      where: { id: { in: validIds } },
    });
    return { deleted: res.count };
  }

  async testConnection(
    id: string,
    user?: { role: string; companyId?: string },
  ) {
    const charger = await this.assertCompanyAccess(id, user);
    if (!charger || !charger.ocppId) {
      return {
        connected: false,
        ocppId: null,
        reason: 'Charger not found or no OCPP ID',
      };
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

  async getConnectedChargers(user?: { role: string; companyId?: string }) {
    const connections = this.ocppService.connections;
    const connectedOcppIds = Array.from(connections.keys()).filter((ocppId) => {
      const ws = connections.get(ocppId);
      return ws && ws.readyState === 1;
    });

    const where: {
      ocppId: { in: string[] };
      station?: { companyId: string };
    } = { ocppId: { in: connectedOcppIds } };

    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      where.station = { companyId: user.companyId };
    }

    const chargers = await this.prisma.charger.findMany({
      where,
      select: {
        id: true,
        ocppId: true,
        serialNumber: true,
        model: true,
        status: true,
        station: { select: { name: true } },
      },
    });

    return chargers.map((c) => ({
      ...c,
      connected: true,
    }));
  }
}
