import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationStatus } from '../../common/enums';

@Injectable()
export class StationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { status?: string; city?: string; companyId?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status as StationStatus;
    if (filters?.city) where.city = filters.city;
    if (filters?.companyId) where.companyId = filters.companyId;

    return this.prisma.station.findMany({
      where,
      include: { chargers: true, tariff: true },
    });
  }

  async findById(id: string) {
    return this.prisma.station.findUnique({
      where: { id },
      include: { chargers: { include: { connectors: true } }, tariff: true, company: true },
    });
  }

  async create(dto: CreateStationDto) {
    return this.prisma.station.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateStationDto) {
    return this.prisma.station.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.station.delete({ where: { id } });
  }
}
