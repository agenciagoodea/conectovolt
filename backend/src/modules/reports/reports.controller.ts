import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('charging')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Relatorio de recargas' })
  getCharging(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @CurrentUser('companyId') companyId?: string,
  ) {
    return this.reportsService.getChargingReport({
      startDate,
      endDate,
      companyId,
    });
  }

  @Get('charging/export')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Exportar relatorio de recargas (CSV)' })
  async exportCharging(
    @Res() res: Response,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @CurrentUser('companyId') companyId?: string,
  ) {
    const report = await this.reportsService.getChargingReport({
      startDate,
      endDate,
      companyId,
    });
    const csv = this.reportsService.generateCsv(
      [
        'Data',
        'Usuario',
        'Posto',
        'Carregador',
        'Energia (kWh)',
        'Valor (R$)',
        'Status',
      ],
      report.sessions.map((s) => [
        new Date(s.startTime).toISOString(),
        s.user?.name || '',
        s.station?.name || '',
        s.charger?.serialNumber || '',
        String(Number(s.energyKwh).toFixed(2)),
        String(Number(s.amount).toFixed(2)),
        s.status,
      ]),
    );
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio-recargas.csv',
    );
    res.send(csv);
  }

  @Get('financial')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Relatorio financeiro' })
  getFinancial(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.reportsService.getFinancialReport({ startDate, endDate });
  }

  @Get('financial/export')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Exportar relatorio financeiro (CSV)' })
  async exportFinancial(
    @Res() res: Response,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const report = await this.reportsService.getFinancialReport({
      startDate,
      endDate,
    });
    const csv = this.reportsService.generateCsv(
      [
        'Data',
        'Usuario',
        'Posto',
        'Empresa',
        'Valor Bruto',
        'Comissao',
        'Repasse',
      ],
      report.payments.map((p) => [
        new Date(p.createdAt).toISOString(),
        p.session?.user?.name || '',
        p.session?.station?.name || '',
        p.session?.station?.company?.name || '',
        String(Number(p.amount).toFixed(2)),
        String(Number(p.commission?.platformAmount || 0).toFixed(2)),
        String(Number(p.commission?.operatorAmount || 0).toFixed(2)),
      ]),
    );
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio-financeiro.csv',
    );
    res.send(csv);
  }

  @Get('energy')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Relatorio de energia' })
  getEnergy(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @CurrentUser('companyId') companyId?: string,
  ) {
    return this.reportsService.getEnergyReport({
      startDate,
      endDate,
      companyId,
    });
  }

  @Get('equipment')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Relatorio de equipamentos' })
  getEquipment(@CurrentUser('companyId') companyId?: string) {
    return this.reportsService.getEquipmentReport({ companyId });
  }
}
