import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;

    return this.prisma.vehicle.findMany({
      where,
      orderBy: { brand: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async create(userId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...dto,
        userId,
        batteryCapacity: dto.batteryCapacity || 0,
      },
    });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
