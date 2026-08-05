import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TariffsService } from './tariffs.service';
import { CreateTariffDto, UpdateTariffDto } from './dto/tariff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Tariffs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Criar tarifa' })
  create(@Body() dto: CreateTariffDto) {
    return this.tariffsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarifas' })
  findAll(@Query('company_id') companyId?: string) {
    return this.tariffsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarifa por ID' })
  findOne(@Param('id') id: string) {
    return this.tariffsService.findById(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar tarifa' })
  update(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
    return this.tariffsService.update(id, dto);
  }

  @Post(':id/toggle')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar/desativar tarifa' })
  toggleStatus(@Param('id') id: string) {
    return this.tariffsService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover tarifa' })
  remove(@Param('id') id: string) {
    return this.tariffsService.remove(id);
  }
}
