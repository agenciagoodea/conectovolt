import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Criar registro de manutenção' })
  create(
    @Body()
    data: {
      chargerId: string;
      title: string;
      description?: string;
      type?: string;
      priority?: string;
      scheduledAt?: string;
      assignedTo?: string;
      cost?: number;
    },
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.maintenanceService.create({
      ...data,
      companyId: user.companyId!,
    });
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar registros de manutenção' })
  findAll(
    @Query('charger_id') chargerId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.maintenanceService.findAll(
      {
        companyId: user?.companyId,
        chargerId,
        status,
        priority,
      },
      {
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      },
    );
  }

  @Get('upcoming')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Próximas manutenções agendadas' })
  getUpcoming(@CurrentUser() user?: { role: string; companyId?: string }) {
    return this.maintenanceService.getUpcoming(user?.companyId);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Estatísticas de manutenção' })
  getStats(@CurrentUser() user?: { role: string; companyId?: string }) {
    return this.maintenanceService.getStats(user?.companyId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Buscar registro de manutenção por ID' })
  findById(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.maintenanceService.findById(id, user?.companyId);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar status da manutenção' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.maintenanceService.updateStatus(id, status, user?.companyId);
  }
}
