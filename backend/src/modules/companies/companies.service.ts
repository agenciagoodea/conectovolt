import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.company.findMany({
      where,
      include: { _count: { select: { stations: true, users: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        stations: { include: { chargers: { include: { connectors: true } } } },
        users: { select: { id: true, name: true, email: true, role: true } },
        wallet: true,
        tariffs: true,
      },
    });
  }

  async create(dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({ where: { document: dto.document } });
    if (existing) {
      throw new BadRequestException('Company document already registered');
    }

    const company = await this.prisma.company.create({
      data: { ...dto, status: 'PENDING' },
    });

    await this.prisma.wallet.create({
      data: { companyId: company.id, balance: 0 },
    });

    this.logger.log(`Company created: ${company.name} (PENDING)`);

    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async approve(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new BadRequestException('Company not found');
    if (company.status !== 'PENDING') throw new BadRequestException('Company is not pending approval');

    const updated = await this.prisma.company.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    this.logger.log(`Company approved: ${company.name}`);

    return updated;
  }

  async reject(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new BadRequestException('Company not found');

    const updated = await this.prisma.company.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    this.logger.log(`Company rejected: ${company.name}`);

    return updated;
  }

  async remove(id: string) {
    // Clean up related records before deleting
    await this.prisma.user.updateMany({ where: { companyId: id }, data: { companyId: null } });
    await this.prisma.tariff.deleteMany({ where: { companyId: id } });
    await this.prisma.commission.deleteMany({ where: { companyId: id } });
    await this.prisma.platformUsage.deleteMany({ where: { companyId: id } });
    await this.prisma.subscription.deleteMany({ where: { companyId: id } });
    await this.prisma.wallet.deleteMany({ where: { companyId: id } });

    const stations = await this.prisma.station.findMany({ where: { companyId: id }, select: { id: true } });
    for (const s of stations) {
      const chargers = await this.prisma.charger.findMany({ where: { stationId: s.id }, select: { id: true } });
      for (const c of chargers) {
        await this.prisma.connector.deleteMany({ where: { chargerId: c.id } });
        await this.prisma.chargingSession.updateMany({ where: { chargerId: c.id }, data: { chargerId: 'deleted' } as any });
        await this.prisma.charger.delete({ where: { id: c.id } });
      }
      await this.prisma.chargingSession.updateMany({ where: { stationId: s.id }, data: { stationId: 'deleted' } as any });
      await this.prisma.station.delete({ where: { id: s.id } });
    }

    return this.prisma.company.delete({ where: { id } });
  }
}
