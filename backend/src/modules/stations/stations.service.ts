import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationStatus } from '../../common/enums';

@Injectable()
export class StationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters?: {
      status?: string;
      city?: string;
      companyId?: string;
    },
    user?: { role: string; companyId?: string },
  ) {
    const where: {
      status?: StationStatus;
      city?: string;
      companyId?: string;
    } = {};
    if (filters?.status) where.status = filters.status as StationStatus;
    if (filters?.city) where.city = filters.city;

    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      where.companyId = user.companyId;
    } else if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    return this.prisma.station.findMany({
      where,
      include: {
        chargers: true,
        tariff: true,
        company: { select: { id: true, name: true } },
      },
    });
  }

  async findById(id: string, user?: { role: string; companyId?: string }) {
    const station = await this.prisma.station.findUnique({
      where: { id },
      include: {
        chargers: { include: { connectors: true } },
        tariff: true,
        company: true,
      },
    });

    if (!station) {
      throw new NotFoundException('Station not found');
    }

    if (user?.role === 'OPERATOR') {
      if (!user.companyId || station.companyId !== user.companyId) {
        throw new ForbiddenException('You do not have access to this station');
      }
    }

    return station;
  }

  async create(
    dto: CreateStationDto,
    user?: { role: string; companyId?: string },
  ) {
    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      dto = { ...dto, companyId: user.companyId };
    }
    return this.prisma.station.create({ data: dto });
  }

  async update(
    id: string,
    dto: UpdateStationDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.findById(id, user);
    return this.prisma.station.update({ where: { id }, data: dto });
  }

  async remove(id: string, user?: { role: string; companyId?: string }) {
    await this.findById(id, user);

    const chargers = await this.prisma.charger.findMany({
      where: { stationId: id },
      select: { id: true },
    });
    const chargerIds = chargers.map((c) => c.id);

    if (chargerIds.length > 0) {
      await this.prisma.connector.deleteMany({
        where: { chargerId: { in: chargerIds } },
      });
      await this.prisma.chargingSession.deleteMany({
        where: { chargerId: { in: chargerIds } },
      });
      await this.prisma.charger.deleteMany({
        where: { stationId: id },
      });
    }

    await this.prisma.chargingSession.deleteMany({
      where: { stationId: id },
    });

    return this.prisma.station.delete({ where: { id } });
  }
}
