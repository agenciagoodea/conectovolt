import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar alertas' })
  findAll(
    @Query('severity') severity?: string,
    @Query('resolved') resolved?: string,
    @Query('charger_id') chargerId?: string,
    @Query('station_id') stationId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.alertsService.findAll(
      {
        companyId: user?.companyId,
        severity,
        resolved: resolved !== undefined ? resolved === 'true' : undefined,
        chargerId,
        stationId,
      },
      {
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      },
    );
  }

  @Get('counts')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Contagem de alertas por severidade' })
  getSeverityCounts(
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.alertsService.getSeverityCounts(user?.companyId);
  }

  @Get('unresolved-count')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Contagem de alertas não resolvidos' })
  getUnresolvedCount(
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.alertsService.getUnresolvedCount(user?.companyId);
  }

  @Post(':id/resolve')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Resolver alerta' })
  resolve(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.alertsService.resolve(id, user.id);
  }
}
