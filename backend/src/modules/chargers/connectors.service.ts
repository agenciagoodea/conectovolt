import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateConnectorDto, UpdateConnectorDto } from './dto/connector.dto';

@Injectable()
export class ConnectorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCharger(chargerId: string) {
    return this.prisma.connector.findMany({
      where: { chargerId },
      orderBy: { type: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.connector.findUnique({
      where: { id },
      include: { charger: { include: { station: true } } },
    });
  }

  async create(chargerId: string, dto: CreateConnectorDto) {
    const charger = await this.prisma.charger.findUnique({ where: { id: chargerId } });
    if (!charger) throw new BadRequestException('Charger not found');

    return this.prisma.connector.create({
      data: {
        chargerId,
        type: dto.type,
        powerKw: dto.powerKw || 0,
        status: 'AVAILABLE',
      },
    });
  }

  async update(id: string, dto: UpdateConnectorDto) {
    return this.prisma.connector.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    return this.prisma.connector.delete({ where: { id } });
  }
}
