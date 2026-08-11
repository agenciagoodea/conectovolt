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
        images: { orderBy: { isPrimary: 'desc' }, take: 1 },
      },
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm = 50,
    limit = 20,
  ) {
    const stations = await this.prisma.client.$queryRawUnsafe<
      Array<{
        id: string;
        name: string;
        address: string;
        city: string;
        state: string;
        latitude: number;
        longitude: number;
        status: string;
        distance_km: number;
        company_name: string;
        charger_count: bigint;
        available_count: bigint;
        tariff_name: string | null;
        price_per_kwh: number | null;
      }>
    >(
      `
      SELECT 
        s.id,
        s.name,
        s.address,
        s.city,
        s.state,
        s.latitude,
        s.longitude,
        s.status,
        c.name as company_name,
        ROUND(
          6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(s.latitude)) *
            COS(RADIANS(s.longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(s.latitude))
          ), 2
        ) AS distance_km,
        (SELECT COUNT(*) FROM chargers ch WHERE ch.station_id = s.id) AS charger_count,
        (SELECT COUNT(*) FROM chargers ch WHERE ch.station_id = s.id AND ch.status = 'ONLINE') AS available_count,
        t.name AS tariff_name,
        t.price_per_kwh
      FROM stations s
      LEFT JOIN companies c ON c.id = s.company_id
      LEFT JOIN tariffs t ON t.id = s.tariff_id
      WHERE s.status = 'ACTIVE'
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
      LIMIT ?
      `,
      latitude,
      longitude,
      latitude,
      radiusKm,
      limit,
    );

    return stations.map((s) => ({
      ...s,
      chargerCount: Number(s.charger_count),
      availableCount: Number(s.available_count),
      distanceKm: Number(s.distance_km),
    }));
  }

  async findById(id: string, user?: { role: string; companyId?: string }) {
    const station = await this.prisma.station.findUnique({
      where: { id },
      include: {
        chargers: { include: { connectors: true } },
        tariff: true,
        company: true,
        images: { orderBy: { isPrimary: 'desc' } },
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
    let companyId = dto.companyId;
    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      companyId = user.companyId;
    }
    if (!companyId) {
      const mainCompany = await this.prisma.company.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' },
      });
      if (mainCompany) {
        companyId = mainCompany.id;
      }
    }
    return this.prisma.station.create({
      data: { ...dto, companyId },
    });
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
