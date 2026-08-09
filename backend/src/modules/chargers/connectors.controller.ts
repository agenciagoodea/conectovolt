import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConnectorsService } from './connectors.service';
import { CreateConnectorDto, UpdateConnectorDto } from './dto/connector.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Connectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get('charger/:chargerId')
  @ApiOperation({ summary: 'Listar conectores de um carregador' })
  findByCharger(@Param('chargerId') chargerId: string) {
    return this.connectorsService.findByCharger(chargerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conector por ID' })
  findOne(@Param('id') id: string) {
    return this.connectorsService.findById(id);
  }

  @Post('charger/:chargerId')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Adicionar conector ao carregador' })
  create(
    @Param('chargerId') chargerId: string,
    @Body() dto: CreateConnectorDto,
  ) {
    return this.connectorsService.create(chargerId, dto);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar conector' })
  update(@Param('id') id: string, @Body() dto: UpdateConnectorDto) {
    return this.connectorsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover conector' })
  remove(@Param('id') id: string) {
    return this.connectorsService.remove(id);
  }
}
