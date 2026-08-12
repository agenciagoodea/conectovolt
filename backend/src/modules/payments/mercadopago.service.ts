import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, PaymentRefund } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private client: MercadoPagoConfig | null = null;
  private isConfigured = false;
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );
    const nodeEnv = this.configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? 'development';
    this.isProduction = nodeEnv === 'production';

    if (accessToken) {
      this.client = new MercadoPagoConfig({ accessToken });
      this.isConfigured = true;
      this.logger.log('Mercado Pago configured');
    } else if (this.isProduction) {
      this.logger.error(
        'MERCADO_PAGO_ACCESS_TOKEN is not configured. Payment simulation is not allowed in production.',
      );
    } else {
      this.logger.warn(
        'Mercado Pago not configured (MERCADO_PAGO_ACCESS_TOKEN missing). Using simulation mode.',
      );
    }
  }

  get isLive() {
    return this.isConfigured;
  }

  /**
   * Garante que simulação não ocorra em produção.
   * Lança InternalServerErrorException se o ambiente for produção e o token estiver ausente.
   */
  private assertNotProductionWithoutCredentials(): void {
    if (this.isProduction && !this.isConfigured) {
      this.logger.error(
        'Payment attempted in production without MERCADO_PAGO_ACCESS_TOKEN configured.',
      );
      throw new InternalServerErrorException(
        'Payment gateway is not configured. Contact the system administrator.',
      );
    }
  }

  async createPixPayment(
    amount: number,
    description: string,
    payerEmail: string,
  ) {
    this.assertNotProductionWithoutCredentials();

    if (!this.isConfigured) {
      return this.simulatePixPayment(amount, description);
    }

    const payment = new Payment(this.client!);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: { email: payerEmail },
      },
    });

    this.logger.log(`PIX payment created: ${result.id}`);

    return {
      id: result.id,
      status: result.status,
      qrCode: result.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        result.point_of_interaction?.transaction_data?.qr_code_base64,
      copyPaste: result.point_of_interaction?.transaction_data?.qr_code,
      amount: result.transaction_amount,
      dateCreated: result.date_created,
    };
  }

  async createCreditCardPayment(
    amount: number,
    description: string,
    payerEmail: string,
    token: string,
    installments: number = 1,
    paymentMethodId = 'mastercard',
  ) {
    this.assertNotProductionWithoutCredentials();

    if (!this.isConfigured) {
      return this.simulateCardPayment(amount, description);
    }

    const payment = new Payment(this.client!);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: paymentMethodId,
        token,
        installments,
        payer: { email: payerEmail },
      },
    });

    this.logger.log(`Credit card payment created: ${result.id}`);

    return {
      id: result.id,
      status: result.status,
      amount: result.transaction_amount,
      dateCreated: result.date_created,
    };
  }

  async getPaymentStatus(paymentId: number) {
    this.assertNotProductionWithoutCredentials();

    if (!this.isConfigured) {
      return { id: paymentId, status: 'approved' };
    }

    const payment = new Payment(this.client!);
    const result = await payment.get({ id: paymentId });

    return {
      id: result.id,
      status: result.status,
      amount: result.transaction_amount,
      dateApproved: result.date_approved,
    };
  }

  /**
   * Solicita o estorno total de um pagamento aprovado no Mercado Pago.
   *
   * Utiliza PaymentRefund.total() — operação de REFUND real, diferente de
   * cancelamento (Payment.cancel). Cancelamentos se aplicam apenas a
   * pagamentos ainda não processados/aprovados.
   *
   * Em desenvolvimento (sem token): retorna simulação apenas para facilitar
   * testes locais. Em produção sem token: lança erro (assertNotProductionWithoutCredentials).
   */
  async refundPayment(paymentId: number) {
    this.assertNotProductionWithoutCredentials();

    if (!this.isConfigured) {
      // Simulação permitida SOMENTE em desenvolvimento/teste
      return this.simulateRefund(paymentId);
    }

    const refund = new PaymentRefund(this.client!);
    const result = await refund.total({ payment_id: paymentId });

    this.logger.log(
      `Refund created for payment ${paymentId}: refund_id=${result.id} status=${result.status}`,
    );

    return {
      id: result.id,
      paymentId: result.payment_id,
      status: result.status,
      amount: result.amount,
      dateCreated: result.date_created,
    };
  }

  private simulatePixPayment(amount: number, description: string) {
    const simulatedId = `sim_pix_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    this.logger.log(`[SIMULATED] PIX payment: R$${amount} - ${description}`);

    return {
      id: simulatedId,
      status: 'pending',
      qrCode: `simulated-pix-qrcode-${simulatedId}`,
      qrCodeBase64: '',
      copyPaste: `00020126580014br.gov.bcb.pix0136${simulatedId}5204000053039865405${amount.toFixed(2)}5802BR5925EVCHARGE`,
      amount,
      dateCreated: new Date().toISOString(),
    };
  }

  private simulateCardPayment(amount: number, description: string) {
    const simulatedId = `sim_card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    this.logger.log(`[SIMULATED] Card payment: R$${amount} - ${description}`);

    return {
      id: simulatedId,
      status: 'approved',
      amount,
      dateCreated: new Date().toISOString(),
    };
  }

  /**
   * Simulação de estorno para ambiente de DESENVOLVIMENTO e TESTE.
   * NÃO deve ser executado em produção (bloqueado por assertNotProductionWithoutCredentials).
   */
  private simulateRefund(paymentId: number) {
    const simulatedRefundId = Math.floor(Math.random() * 900000) + 100000;

    this.logger.log(`[SIMULATED] Refund for payment ${paymentId}: refund_id=${simulatedRefundId}`);

    return {
      id: simulatedRefundId,
      paymentId,
      status: 'approved',
      amount: null,
      dateCreated: new Date().toISOString(),
    };
  }
}
