import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTariffDto, UpdateTariffDto } from './dto/tariff.dto';

@Injectable()
export class TariffsService {
  private readonly logger = new Logger(TariffsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId?: string) {
    const where: any = {};
    if (companyId) where.companyId = companyId;

    return this.prisma.tariff.findMany({
      where,
      include: { company: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.tariff.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        stations: { select: { id: true, name: true } },
      },
    });
  }

  async create(dto: CreateTariffDto) {
    const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
    if (!company) throw new BadRequestException('Company not found');

    const tariff = await this.prisma.tariff.create({ data: dto as any });

    this.logger.log(`Tariff created: ${tariff.name} - R$${tariff.pricePerKwh}/kWh`);

    return tariff;
  }

  async update(id: string, dto: UpdateTariffDto) {
    return this.prisma.tariff.update({ where: { id }, data: dto });
  }

  async toggleStatus(id: string) {
    const tariff = await this.prisma.tariff.findUnique({ where: { id } });
    if (!tariff) throw new BadRequestException('Tariff not found');

    const updated = await this.prisma.tariff.update({
      where: { id },
      data: { isActive: !tariff.isActive },
    });

    this.logger.log(`Tariff ${tariff.name} ${updated.isActive ? 'activated' : 'deactivated'}`);

    return updated;
  }

  async remove(id: string) {
    return this.prisma.tariff.delete({ where: { id } });
  }
}
