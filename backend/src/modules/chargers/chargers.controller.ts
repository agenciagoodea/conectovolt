import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChargersService } from './chargers.service';
import { CreateChargerDto, UpdateChargerDto, UpdateChargerStatusDto } from './dto/charger.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Chargers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chargers')
export class ChargersController {
  constructor(private readonly chargersService: ChargersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Criar carregador' })
  create(@Body() dto: CreateChargerDto) {
    return this.chargersService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Listar carregadores' })
  findAll(@Query('station_id') stationId?: string) {
    return this.chargersService.findAll(stationId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Buscar carregador por ID' })
  findOne(@Param('id') id: string) {
    return this.chargersService.findById(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar carregador' })
  update(@Param('id') id: string, @Body() dto: UpdateChargerDto) {
    return this.chargersService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar status do carregador' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateChargerStatusDto) {
    return this.chargersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover carregador' })
  remove(@Param('id') id: string) {
    return this.chargersService.remove(id);
  }
}
