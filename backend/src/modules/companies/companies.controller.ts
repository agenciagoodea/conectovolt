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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, AdminUpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Criar empresa (Super Admin)' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar empresas' })
  findAll(
    @Query('status') status?: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.companiesService.findAll(status, user);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.companiesService.findById(id, user);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Atualizar empresa (Super Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: AdminUpdateCompanyDto,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.companiesService.update(id, dto, user);
  }

  @Post(':id/approve')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprovar empresa (Super Admin)' })
  approve(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.companiesService.approve(id, user);
  }

  @Post(':id/reject')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejeitar empresa (Super Admin)' })
  reject(
    @Param('id') id: string,
    @CurrentUser() user?: { role: string; companyId?: string },
  ) {
    return this.companiesService.reject(id, user);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Remover empresa (Super Admin)' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
