import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChargersService } from './chargers.service';
import {
  CreateChargerDto,
  UpdateChargerDto,
  UpdateChargerStatusDto,
} from './dto/charger.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chargers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chargers')
export class ChargersController {
  constructor(private readonly chargersService: ChargersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Criar carregador' })
  create(
    @Body() dto: CreateChargerDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.create(dto, user);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Listar carregadores' })
  findAll(
    @Query('station_id') stationId?: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.chargersService.findAll(stationId, user);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar carregador' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChargerDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.update(id, dto, user);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar status do carregador' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateChargerStatusDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.updateStatus(id, dto, user);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover carregador' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.remove(id, user);
  }

  @Post('bulk-delete')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover varios carregadores em lote' })
  bulkDelete(
    @Body() body: { ids: string[] },
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.bulkDelete(body.ids || [], user);
  }

  @Get('connections')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar carregadores conectados (WebSocket ativo)' })
  getConnected(@CurrentUser() user: { role: string; companyId?: string }) {
    return this.chargersService.getConnectedChargers(user);
  }

  @Get('telemetry')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Buscar telemetria em tempo real de todos os conectores' })
  getTelemetry() {
    return this.chargersService.getConnectorTelemetry();
  }

  @Get(':id/test-connection')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({
    summary: 'Testar conectividade do carregador via WebSocket OCPP',
  })
  testConnection(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.chargersService.testConnection(id, user);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Buscar carregador por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.chargersService.findById(id, user);
  }
}
