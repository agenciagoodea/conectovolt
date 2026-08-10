import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTariffDto, UpdateTariffDto } from './dto/tariff.dto';

@Injectable()
export class TariffsService {
  private readonly logger = new Logger(TariffsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    companyId?: string,
    user?: { role: string; companyId?: string },
  ) {
    const where: { companyId?: string } = {};
    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      where.companyId = user.companyId;
    } else if (companyId) {
      where.companyId = companyId;
    }

    return this.prisma.tariff.findMany({
      where,
      include: { company: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, user?: { role: string; companyId?: string }) {
    const tariff = await this.prisma.tariff.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        stations: { select: { id: true, name: true } },
      },
    });

    if (!tariff) {
      throw new NotFoundException('Tariff not found');
    }

    if (user?.role === 'OPERATOR') {
      if (!user.companyId || tariff.companyId !== user.companyId) {
        throw new ForbiddenException('You do not have access to this tariff');
      }
    }

    return tariff;
  }

  async create(
    dto: CreateTariffDto,
    user?: { role: string; companyId?: string },
  ) {
    if (user?.role === 'OPERATOR') {
      if (!user.companyId) {
        throw new ForbiddenException('Operator has no company associated');
      }
      dto = { ...dto, companyId: user.companyId };
    }

    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) throw new BadRequestException('Company not found');

    const tariff = await this.prisma.tariff.create({ data: dto });

    this.logger.log(
      `Tariff created: ${tariff.name} - R$${tariff.pricePerKwh}/kWh`,
    );

    return tariff;
  }

  async update(
    id: string,
    dto: UpdateTariffDto,
    user?: { role: string; companyId?: string },
  ) {
    await this.findById(id, user);
    return this.prisma.tariff.update({ where: { id }, data: dto });
  }

  async toggleStatus(id: string, user?: { role: string; companyId?: string }) {
    const tariff = await this.findById(id, user);

    const updated = await this.prisma.tariff.update({
      where: { id },
      data: { isActive: !tariff.isActive },
    });

    this.logger.log(
      `Tariff ${tariff.name} ${updated.isActive ? 'activated' : 'deactivated'}`,
    );

    return updated;
  }

  async remove(id: string, user?: { role: string; companyId?: string }) {
    await this.findById(id, user);
    return this.prisma.tariff.delete({ where: { id } });
  }
}
