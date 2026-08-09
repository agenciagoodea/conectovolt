import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string) {
    const where: { userId?: string } = {};
    if (userId) where.userId = userId;

    return this.prisma.vehicle.findMany({
      where,
      orderBy: { brand: 'asc' },
    });
  }

  async findById(id: string, userId?: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (userId && vehicle.userId !== userId) {
      throw new ForbiddenException('You do not own this vehicle');
    }
    return vehicle;
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

  async update(id: string, userId: string, dto: UpdateVehicleDto) {
    await this.findById(id, userId);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
