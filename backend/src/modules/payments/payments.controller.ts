import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
  Headers,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentWebhookDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pagamento (PIX ou Cartao)' })
  create(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: { id: string; email: string; role: string },
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.paymentsService.create(dto, user);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'OPERATOR')
  @ApiOperation({ summary: 'Listar pagamentos por status' })
  findAll(
    @Query('status') status?: string,
    @CurrentUser() user?: { id: string; role: string; companyId?: string },
  ) {
    if (status) {
      return this.paymentsService.getPaymentsByStatus(status, user);
    }
    return this.paymentsService.getPaymentsByStatus('APPROVED', user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar pagamento por ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string; companyId?: string },
  ): Promise<unknown> {
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.paymentsService.findById(id, user);
  }

  @Patch(':id/approve')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Aprovar pagamento manualmente (Super Admin)' })
  approve(@Param('id') id: string) {
    return this.paymentsService.approvePayment(id);
  }

  @Patch(':id/fail')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Marcar pagamento como falho' })
  fail(@Param('id') id: string) {
    return this.paymentsService.failPayment(id);
  }

  @Patch(':id/refund')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Reembolsar pagamento' })
  refund(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id);
  }
}

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('payment')
  @ApiOperation({ summary: 'Webhook do Mercado Pago' })
  handlePaymentWebhook(
    @Body() data: PaymentWebhookDto,
    @Headers('x-signature') signature?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const secret = this.configService.get<string>(
      'MERCADO_PAGO_WEBHOOK_SECRET',
    );

    if (!secret) {
      this.logger.error('Webhook secret not configured');
      throw new BadRequestException('Webhook not configured');
    }

    if (!signature) {
      this.logger.warn(`Webhook missing signature (request ${requestId})`);
      throw new BadRequestException('Missing signature');
    }

    const signatureParts = signature
      .split(',')
      .reduce<Record<string, string>>((parts, part) => {
        const [key, value] = part.split('=', 2);
        if (key && value) parts[key.trim()] = value.trim();
        return parts;
      }, {});
    const timestamp = signatureParts.ts;
    const receivedHash = signatureParts.v1;
    const paymentId = data.data?.id ? String(data.data.id).toLowerCase() : '';
    const manifest = `id:${paymentId};request-id:${requestId || ''};ts:${timestamp};`;
    const computed = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    if (
      !timestamp ||
      !receivedHash ||
      receivedHash.length !== computed.length ||
      !crypto.timingSafeEqual(
        Buffer.from(computed, 'utf8'),
        Buffer.from(receivedHash, 'utf8'),
      )
    ) {
      this.logger.warn('Webhook signature mismatch');
      throw new BadRequestException('Invalid signature');
    }

    return this.paymentsService.handleWebhook(data);
  }
}
