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
import { StationsService } from './stations.service';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Stations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Criar posto' })
  create(
    @Body() dto: CreateStationDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.stationsService.create(dto, user);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Listar postos' })
  findAll(
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('company_id') companyId?: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.stationsService.findAll({ status, city, companyId }, user);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR', 'CUSTOMER')
  @ApiOperation({ summary: 'Buscar posto por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.stationsService.findById(id, user);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Atualizar posto' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStationDto,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.stationsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Remover posto' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { role: string; companyId?: string },
  ) {
    return this.stationsService.remove(id, user);
  }
}
