import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Plans (admin)
  @Get('plans')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar planos disponiveis' })
  getPlans() {
    return this.billingService.getPlans();
  }

  @Post('plans')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Criar plano' })
  createPlan(@Body() body: CreatePlanDto) {
    return this.billingService.createPlan(body);
  }

  @Patch('plans/:id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Atualizar plano' })
  updatePlan(@Param('id') id: string, @Body() body: UpdatePlanDto) {
    return this.billingService.updatePlan(id, body);
  }

  // Subscriptions
  @Get('subscription')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Ver minha assinatura' })
  getSubscription(@CurrentUser('companyId') companyId: string) {
    return this.billingService.getSubscription(companyId);
  }

  @Post('subscribe')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Assinar/alterar plano' })
  subscribe(
    @CurrentUser('companyId') companyId: string,
    @Body() body: { planId: string },
  ) {
    return this.billingService.subscribe(companyId, body.planId);
  }

  @Post('cancel')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Cancelar assinatura' })
  cancel(@CurrentUser('companyId') companyId: string) {
    return this.billingService.cancelSubscription(companyId);
  }

  // Limits
  @Get('limits')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Verificar limites do plano' })
  checkLimits(@CurrentUser('companyId') companyId: string) {
    return this.billingService.checkLimits(companyId);
  }

  // Usage
  @Get('usage')
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Ver uso da plataforma' })
  getUsage(@CurrentUser('companyId') companyId: string) {
    return this.billingService.getUsageHistory(companyId);
  }

  @Post('usage/track')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Registrar uso mensal' })
  trackUsage(@CurrentUser('companyId') companyId: string) {
    return this.billingService.trackUsage(companyId);
  }

  // Admin
  @Get('admin/subscriptions')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Listar todas assinaturas' })
  getAllSubscriptions() {
    return this.billingService.getAllSubscriptions();
  }
}
