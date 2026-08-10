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
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Connectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get('charger/:chargerId')
  @ApiOperation({ summary: 'Listar conectores de um carregador' })
  findByCharger(
    @Param('chargerId') chargerId: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.connectorsService.findByCharger(chargerId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conector por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.connectorsService.findById(id, user);
  }

  @Post('charger/:chargerId')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Adicionar conector ao carregador' })
  create(
    @Param('chargerId') chargerId: string,
    @Body() dto: CreateConnectorDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.connectorsService.create(chargerId, dto, user);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar conector' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConnectorDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.connectorsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover conector' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.connectorsService.remove(id, user);
  }
}
