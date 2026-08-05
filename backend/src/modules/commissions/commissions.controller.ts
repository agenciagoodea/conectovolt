import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Commissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Listar comissoes (Super Admin)' })
  findAll(@Query('company_id') companyId?: string) {
    return this.commissionsService.findAll(companyId);
  }
}

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Consultar saldo da carteira' })
  getBalance(@CurrentUser('companyId') companyId: string) {
    if (!companyId) {
      return { balance: 0 };
    }
    return this.commissionsService.getWalletBalance(companyId);
  }

  @Post('withdraw')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Solicitar saque' })
  withdraw(@CurrentUser('companyId') companyId: string, @Body('amount') amount: number) {
    if (!companyId) {
      throw new Error('No company associated');
    }
    return this.commissionsService.requestWithdrawal(companyId, amount);
  }

  @Get('transactions')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Extrato de transacoes' })
  getTransactions(@CurrentUser('companyId') companyId: string) {
    if (!companyId) {
      return [];
    }
    return this.commissionsService.getTransactions(companyId);
  }
}
