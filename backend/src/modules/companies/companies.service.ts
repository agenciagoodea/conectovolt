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
    return this.prisma.company.delete({ where: { id } });
  }
}
