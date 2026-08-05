import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChargingService } from './charging.service';
import { StartChargingDto, UpdateEnergyDto, StopChargingDto } from './dto/charging.dto';

@ApiTags('Charging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('charging')
export class ChargingController {
  constructor(private readonly chargingService: ChargingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar sessao de recarga' })
  start(@CurrentUser('id') userId: string, @Body() dto: StartChargingDto) {
    return this.chargingService.start(userId, dto);
  }

  @Patch(':id/energy')
  @ApiOperation({ summary: 'Atualizar consumo de energia em tempo real' })
  updateEnergy(@Param('id') id: string, @Body() dto: UpdateEnergyDto) {
    return this.chargingService.updateEnergy(id, dto);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Finalizar sessao de recarga' })
  stop(@Param('id') id: string, @Body() dto: StopChargingDto) {
    return this.chargingService.stop(id, dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Buscar sessao ativa do usuario' })
  getActive(@CurrentUser('id') userId: string) {
    return this.chargingService.getActiveSession(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historico de recargas com paginacao' })
  history(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chargingService.getUserHistory(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sessao detalhada por ID' })
  findOne(@Param('id') id: string) {
    return this.chargingService.getSessionById(id);
  }
}
