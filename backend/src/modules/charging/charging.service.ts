import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StartChargingDto,
  UpdateEnergyDto,
  StopChargingDto,
} from './dto/charging.dto';
import { ChargingGateway } from './gateways/charging.gateway';
import { OcppService } from '../ocpp/ocpp.service';

@Injectable()
export class ChargingService {
  private readonly logger = new Logger(ChargingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chargingGateway: ChargingGateway,
    private readonly ocppService: OcppService,
  ) {}

  async start(userId: string, dto: StartChargingDto) {
    const charger = await this.prisma.charger.findUnique({
      where: { id: dto.chargerId },
      include: { station: { include: { tariff: true } } },
    });

    if (!charger) {
      throw new NotFoundException('Charger not found');
    }

    if (charger.status !== 'ONLINE') {
      throw new BadRequestException('Charger is not online');
    }

    if (dto.stationId && dto.stationId !== charger.stationId) {
      throw new BadRequestException('Station does not belong to this charger');
    }

    if (dto.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: dto.vehicleId },
      });
      if (!vehicle || vehicle.userId !== userId) {
        throw new ForbiddenException('Vehicle does not belong to user');
      }
    }

    const activeSession = await this.prisma.chargingSession.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (activeSession) {
      throw new ConflictException(
        'User already has an active charging session',
      );
    }

    const activeChargerSession = await this.prisma.chargingSession.findFirst({
      where: { chargerId: dto.chargerId, status: 'ACTIVE' },
    });

    if (activeChargerSession) {
      throw new ConflictException('Charger is already in use');
    }

    if (dto.connectorId) {
      const connector = await this.prisma.connector.findUnique({
        where: { id: dto.connectorId },
      });

      if (!connector || connector.chargerId !== dto.chargerId) {
        throw new BadRequestException(
          'Connector does not belong to this charger',
        );
      }

      if (connector.status !== 'AVAILABLE') {
        throw new BadRequestException('Connector is not available');
      }

      await this.prisma.connector.update({
        where: { id: dto.connectorId },
        data: { status: 'CHARGING' },
      });
    }

    const session = await this.prisma.chargingSession.create({
      data: {
        userId,
        chargerId: dto.chargerId,
        connectorId: dto.connectorId,
        vehicleId: dto.vehicleId,
        stationId: dto.stationId || charger.stationId,
        tariffId: charger.station.tariff?.id,
        status: 'ACTIVE',
        startTime: new Date(),
        energyKwh: 0,
        amount: 0,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        station: { select: { id: true, name: true } },
        charger: { select: { id: true, serialNumber: true, model: true } },
      },
    });

    this.chargingGateway.emitSessionStarted({
      sessionId: session.id,
      userId: session.userId,
      chargerId: session.chargerId,
      status: session.status,
      energyKwh: Number(session.energyKwh),
      startTime: session.startTime,
    });

    const connectorNumber = dto.connectorId
      ? parseInt(dto.connectorId.split('-connector-').pop() || '1', 10) || 1
      : 1;

    let ocppSent = false;
    if (charger.ocppId) {
      ocppSent = this.ocppService.sendRemoteStartTransaction(
        charger.ocppId,
        userId,
        connectorNumber,
      );
    }

    this.logger.log(
      `Charging started: session=${session.id}, user=${userId}, charger=${dto.chargerId}, ocpp=${ocppSent ? 'sent' : 'charger offline'}`,
    );

    return { ...session, ocppRemoteStart: ocppSent };
  }

  private async assertSessionOwner(sessionId: string, userId: string) {
    const session = await this.prisma.chargingSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.userId !== userId) {
      throw new ForbiddenException('You do not own this session');
    }
    return session;
  }

  async updateEnergy(sessionId: string, userId: string, dto: UpdateEnergyDto) {
    const session = await this.assertSessionOwner(sessionId, userId);

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Session is not active');
    }

    if (dto.energyKwh < Number(session.energyKwh)) {
      throw new BadRequestException(
        'Energy consumption cannot decrease during a session',
      );
    }

    const updated = await this.prisma.chargingSession.update({
      where: { id: sessionId },
      data: { energyKwh: dto.energyKwh },
    });

    const tariff = await this.getSessionTariff(sessionId);
    const currentAmount = dto.energyKwh * Number(tariff.pricePerKwh);

    this.chargingGateway.emitSessionUpdate({
      sessionId: updated.id,
      userId: updated.userId,
      chargerId: updated.chargerId,
      status: updated.status,
      energyKwh: Number(updated.energyKwh),
      amount: currentAmount,
      startTime: updated.startTime,
    });

    return {
      ...updated,
      currentAmount,
      tariff: tariff.name,
      pricePerKwh: Number(tariff.pricePerKwh),
    };
  }

  async stop(sessionId: string, userId: string, dto: StopChargingDto) {
    const session = await this.assertSessionOwner(sessionId, userId);

    if (session.status === 'COMPLETED') {
      return this.getSessionById(sessionId, userId);
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Session is not active');
    }

    const finalEnergy = dto.energyKwh !== undefined
      ? dto.energyKwh
      : Number(session.energyKwh);

    if (finalEnergy < Number(session.energyKwh)) {
      throw new BadRequestException(
        'Energy consumption cannot decrease during a session',
      );
    }

    const tariff = await this.getSessionTariff(sessionId);
    const amount = finalEnergy * Number(tariff.pricePerKwh);

    const updated = await this.prisma.chargingSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        energyKwh: finalEnergy,
        amount,
      },
      include: {
        user: { select: { id: true, name: true } },
        station: { select: { id: true, name: true } },
        charger: { select: { id: true, serialNumber: true, ocppId: true } },
        connector: true,
      },
    });

    if (session.connectorId) {
      await this.prisma.connector.update({
        where: { id: session.connectorId },
        data: { status: 'AVAILABLE' },
      });
    }

    const txId = this.ocppService.getTransactionIdForSession(sessionId);
    let ocppSent = false;
    if (txId !== null && updated.charger?.ocppId) {
      ocppSent = this.ocppService.sendRemoteStopTransaction(
        updated.charger.ocppId,
        txId,
      );
    }

    this.chargingGateway.emitSessionCompleted({
      sessionId: updated.id,
      userId: updated.userId,
      chargerId: updated.chargerId,
      status: updated.status,
      energyKwh: Number(updated.energyKwh),
      amount: Number(updated.amount),
      startTime: updated.startTime,
      endTime: updated.endTime!,
    });

    this.logger.log(
      `Charging completed: session=${session.id}, energy=${finalEnergy}kWh, amount=R$${amount}, ocpp=${ocppSent ? 'sent' : 'n/a'}`,
    );

    return {
      ...updated,
      tariff: tariff.name,
      pricePerKwh: Number(tariff.pricePerKwh),
      ocppRemoteStop: ocppSent,
      durationMinutes: updated.endTime
        ? Math.round(
            (updated.endTime.getTime() - updated.startTime.getTime()) / 60000,
          )
        : 0,
    };
  }

  async getSessionById(id: string, userId: string) {
    const session = await this.prisma.chargingSession.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        station: { select: { id: true, name: true, address: true } },
        charger: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            manufacturer: true,
          },
        },
        connector: { select: { id: true, type: true } },
        vehicle: {
          select: { id: true, brand: true, model: true, plate: true },
        },
        payment: true,
        tariff: { select: { id: true, name: true, pricePerKwh: true } },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not own this session');
    }

    const durationMinutes = session.endTime
      ? Math.round(
          (session.endTime.getTime() - session.startTime.getTime()) / 60000,
        )
      : session.status === 'ACTIVE'
        ? Math.round((Date.now() - session.startTime.getTime()) / 60000)
        : 0;

    return { ...session, durationMinutes };
  }

  async getUserHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.chargingSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
        include: {
          station: { select: { id: true, name: true, address: true } },
          charger: { select: { id: true, serialNumber: true, model: true } },
          payment: {
            select: { id: true, status: true, amount: true, gateway: true },
          },
          tariff: { select: { name: true, pricePerKwh: true } },
        },
      }),
      this.prisma.chargingSession.count({ where: { userId } }),
    ]);

    return {
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getActiveSession(userId: string) {
    const session = await this.prisma.chargingSession.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        station: { select: { id: true, name: true, address: true } },
        charger: { select: { id: true, serialNumber: true, model: true } },
        connector: { select: { id: true, type: true } },
        tariff: { select: { name: true, pricePerKwh: true } },
      },
    });

    if (!session) return null;

    const currentAmount =
      Number(session.energyKwh) * Number(session.tariff?.pricePerKwh || 0);
    const durationMinutes = Math.round(
      (Date.now() - session.startTime.getTime()) / 60000,
    );

    return { ...session, currentAmount, durationMinutes };
  }

  private async getSessionTariff(sessionId: string) {
    const session = await this.prisma.chargingSession.findUnique({
      where: { id: sessionId },
      include: {
        tariff: true,
        station: { include: { tariff: true } },
      },
    });

    // Keep the tariff selected when the session started, even if the station's
    // current tariff is later changed or deactivated.
    if (session?.tariff) {
      return session.tariff;
    }

    if (session?.station?.tariff?.isActive) {
      return session.station.tariff;
    }

    const companyTariff = await this.prisma.tariff.findFirst({
      where: {
        companyId: session?.station?.companyId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!companyTariff) {
      throw new BadRequestException('No active tariff found for this company. Cannot calculate charging cost.');
    }

    return companyTariff;
  }
}
