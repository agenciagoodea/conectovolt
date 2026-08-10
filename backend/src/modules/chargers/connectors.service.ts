import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateConnectorDto, UpdateConnectorDto } from './dto/connector.dto';

@Injectable()
export class ConnectorsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertAccess(
    connectorId: string,
    user?: { role: string; companyId?: string },
  ) {
    const connector = await this.prisma.connector.findUnique({
      where: { id: connectorId },
      include: { charger: { include: { station: true } } },
    });

    if (!connector) {
      throw new NotFoundException('Connector not found');
    }

    if (
      user?.role === 'OPERATOR' &&
      (!user.companyId ||
        connector.charger.station.companyId !== user.companyId)
    ) {
      throw new ForbiddenException('You do not have access to this connector');
    }

    return connector;
  }

  private async assertChargerAccess(
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

    if (
      user?.role === 'OPERATOR' &&
      (!user.companyId || charger.station.companyId !== user.companyId)
    ) {
      throw new ForbiddenException('You do not have access to this charger');
    }

    return charger;
  }

  async findByCharger(
    chargerId: string,
    user?: { role: string; companyId?: string },
  ) {
    await this.assertChargerAccess(chargerId, user);
    return this.prisma.connector.findMany({
      where: { chargerId },
      orderBy: { type: 'asc' },
    });
  }

  async findById(id: string, user?: { role: string; companyId?: string }) {
    return this.assertAccess(id, user);
  }

  async create(
    chargerId: string,
    dto: CreateConnectorDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.assertChargerAccess(chargerId, user);

    return this.prisma.connector.create({
      data: {
        chargerId,
        type: dto.type,
        powerKw: dto.powerKw || 0,
        status: 'AVAILABLE',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateConnectorDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.assertAccess(id, user);
    return this.prisma.connector.update({ where: { id }, data: dto });
  }

  async remove(id: string, user?: { role: string; companyId?: string }) {
    await this.assertAccess(id, user);
    return this.prisma.connector.delete({ where: { id } });
  }
}
