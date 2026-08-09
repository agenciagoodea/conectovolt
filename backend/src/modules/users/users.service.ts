import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AdminUpdateUserDto,
} from './dto/user.dto';
import { hashPassword } from '../../common/utils/password.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        company: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (dto.companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: dto.role || 'CUSTOMER',
        companyId: dto.companyId || null,
      },
    });

    this.logger.log(`User created by admin: ${user.email}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _unused, ...result } = user;
    return result;
  }

  async update(
    id: string,
    dto: UpdateUserDto | AdminUpdateUserDto,
    actorId: string,
  ) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('User not found');
    }

    const adminDto = dto as AdminUpdateUserDto;
    if (adminDto.companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: adminDto.companyId },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
    }

    // Operators cannot modify users outside their company or modify SUPER_ADMIN users
    const actor = await this.prisma.user.findUnique({ where: { id: actorId } });
    if (actor?.role === 'OPERATOR') {
      if (existing.role === 'SUPER_ADMIN') {
        throw new BadRequestException('Cannot modify super admin');
      }
      if (existing.companyId !== actor.companyId) {
        throw new BadRequestException(
          'Cannot modify user outside your company',
        );
      }
      delete adminDto.role;
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
