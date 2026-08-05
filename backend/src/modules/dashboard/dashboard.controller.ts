import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('operator')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Dashboard do operador' })
  getOperator(@CurrentUser('companyId') companyId: string) {
    return this.dashboardService.getOperatorDashboard(companyId);
  }

  @Get('operator/chart')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Dados grafico operador' })
  getOperatorChart(@CurrentUser('companyId') companyId: string) {
    return this.dashboardService.getOperatorChart(companyId);
  }

  @Get('admin')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Dashboard do Super Admin' })
  getAdmin() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('admin/chart')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Dados grafico admin' })
  getAdminChart() {
    return this.dashboardService.getAdminChart();
  }
}
