import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private client: MercadoPagoConfig | null = null;
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );
    if (accessToken) {
      this.client = new MercadoPagoConfig({ accessToken });
      this.isConfigured = true;
      this.logger.log('Mercado Pago configured');
    } else {
      this.logger.warn(
        'Mercado Pago not configured (MERCADO_PAGO_ACCESS_TOKEN missing). Using simulation mode.',
      );
    }
  }

  get isLive() {
    return this.isConfigured;
  }

  async createPixPayment(
    amount: number,
    description: string,
    payerEmail: string,
  ) {
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

  async refundPayment(paymentId: number) {
    if (!this.isConfigured) {
      return { id: paymentId, status: 'refunded' };
    }

    const payment = new Payment(this.client!);
    const result = await payment.cancel({ id: paymentId });
    return { id: result.id, status: result.status };
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
}
