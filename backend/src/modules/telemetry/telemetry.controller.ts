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
import { TelemetryService } from './telemetry.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('events')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Registrar evento de telemetria' })
  createEvent(
    @Body()
    data: {
      chargerId: string;
      sessionId?: string;
      type: string;
      measurand?: string;
      value: number;
      unit?: string;
      severity?: string;
      rawPayload?: string;
    },
  ) {
    return this.telemetryService.recordEvent(data);
  }

  @Get('charger/:chargerId')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Buscar eventos de telemetria por carregador' })
  findByCharger(
    @Param('chargerId') chargerId: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.telemetryService.findByCharger(chargerId, {
      type,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('charger/:chargerId/summary')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Resumo de telemetria do carregador' })
  getChargerSummary(
    @Param('chargerId') chargerId: string,
    @Query('hours') hours?: string,
  ) {
    return this.telemetryService.getChargerSummary(
      chargerId,
      hours ? parseInt(hours, 10) : 24,
    );
  }

  @Get('session/:sessionId')
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Buscar eventos de telemetria da sessão' })
  findBySession(@Param('sessionId') sessionId: string) {
    return this.telemetryService.findBySession(sessionId);
  }

  @Get('station/:stationId/aggregate')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Agregados de telemetria da estação' })
  getStationAggregates(
    @Param('stationId') stationId: string,
    @Query('hours') hours?: string,
  ) {
    return this.telemetryService.getStationAggregates(
      stationId,
      hours ? parseInt(hours, 10) : 24,
    );
  }
}
