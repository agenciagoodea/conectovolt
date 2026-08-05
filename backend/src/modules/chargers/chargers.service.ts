import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChargerDto, UpdateChargerDto, UpdateChargerStatusDto } from './dto/charger.dto';

@Injectable()
export class ChargersService {
  constructor(private readonly prisma: PrismaService) {}

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
}
