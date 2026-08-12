import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoService } from '../mercadopago.service';

/**
 * Cria uma instância de MercadoPagoService com o ambiente e token especificados.
 */
async function buildService(opts: {
  nodeEnv: string;
  accessToken?: string;
}): Promise<MercadoPagoService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MercadoPagoService,
      {
        provide: ConfigService,
        useValue: {
          get: (key: string) => {
            if (key === 'NODE_ENV') return opts.nodeEnv;
            if (key === 'MERCADO_PAGO_ACCESS_TOKEN') return opts.accessToken ?? null;
            if (key === 'MERCADO_PAGO_WEBHOOK_SECRET') return null;
            return null;
          },
        },
      },
    ],
  }).compile();

  return module.get<MercadoPagoService>(MercadoPagoService);
}

// ─────────────────────────────────────────────────────────────────────────────
// Teste 1 — produção sem token → deve lançar erro
// ─────────────────────────────────────────────────────────────────────────────
describe('MercadoPagoService — produção sem token', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    service = await buildService({ nodeEnv: 'production', accessToken: undefined });
  });

  it('createPixPayment deve lançar InternalServerErrorException', async () => {
    await expect(
      service.createPixPayment(100, 'Recarga', 'user@test.com'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('createCreditCardPayment deve lançar InternalServerErrorException', async () => {
    await expect(
      service.createCreditCardPayment(100, 'Recarga', 'user@test.com', 'token123'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('getPaymentStatus deve lançar InternalServerErrorException', async () => {
    await expect(service.getPaymentStatus(123456)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('refundPayment deve lançar InternalServerErrorException', async () => {
    await expect(service.refundPayment(123456)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('isLive deve ser false', () => {
    expect(service.isLive).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Teste 2 — desenvolvimento sem token → simulação permitida
// ─────────────────────────────────────────────────────────────────────────────
describe('MercadoPagoService — desenvolvimento sem token', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    service = await buildService({ nodeEnv: 'development', accessToken: undefined });
  });

  it('createPixPayment deve retornar resposta simulada (id sim_pix_*)', async () => {
    const result = await service.createPixPayment(50, 'Recarga', 'dev@test.com');
    expect(result.id).toMatch(/^sim_pix_/);
    expect(result.status).toBe('pending');
  });

  it('createCreditCardPayment deve retornar resposta simulada (id sim_card_*)', async () => {
    const result = await service.createCreditCardPayment(
      75,
      'Recarga',
      'dev@test.com',
      'fake-token',
    );
    expect(result.id).toMatch(/^sim_card_/);
    expect(result.status).toBe('approved');
  });

  it('getPaymentStatus deve retornar status approved simulado', async () => {
    const result = await service.getPaymentStatus(0);
    expect(result.status).toBe('approved');
  });

  it('refundPayment deve retornar simulação de estorno em desenvolvimento', async () => {
    const result = await service.refundPayment(123456);
    expect(result.paymentId).toBe(123456);
    expect(result.status).toBe('approved');
    expect(result.id).toBeDefined();
  });

  it('isLive deve ser false', () => {
    expect(service.isLive).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Teste 3 — produção com token presente → fluxo real inicializado
// ─────────────────────────────────────────────────────────────────────────────
describe('MercadoPagoService — produção com token', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    service = await buildService({
      nodeEnv: 'production',
      accessToken: 'APP_USR-valid-token-for-test',
    });
  });

  it('isLive deve ser true quando token presente', () => {
    expect(service.isLive).toBe(true);
  });

  it('não deve lançar erro de configuração no construtor', () => {
    expect(service).toBeDefined();
  });

  it('refundPayment em produção com token deve chamar PaymentRefund.total() do SDK', async () => {
    const { PaymentRefund } = await import('mercadopago');
    const totalSpy = jest
      .spyOn(PaymentRefund.prototype, 'total')
      .mockResolvedValue({
        id: 987654,
        payment_id: 123456,
        amount: 100,
        status: 'approved',
        date_created: '2026-08-12T12:00:00Z',
        api_response: { status: 200, headers: {} },
      } as any);

    const result = await service.refundPayment(123456);

    expect(totalSpy).toHaveBeenCalledWith({ payment_id: 123456 });
    expect(result).toEqual({
      id: 987654,
      paymentId: 123456,
      status: 'approved',
      amount: 100,
      dateCreated: '2026-08-12T12:00:00Z',
    });

    totalSpy.mockRestore();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Teste 4 — resposta simulada nunca aprova Payment em produção
// Verifica que a chamada em produção sem token lança erro antes de retornar
// qualquer status que pudesse ser interpretado como 'approved'.
// ─────────────────────────────────────────────────────────────────────────────
describe('MercadoPagoService — resposta simulada não aprova em produção', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    service = await buildService({ nodeEnv: 'production', accessToken: undefined });
  });

  it('createPixPayment não retorna nenhum valor — lança antes de simular', async () => {
    let result: unknown = undefined;
    try {
      result = await service.createPixPayment(100, 'Recarga', 'user@prod.com');
    } catch {
      // esperado
    }
    // Nunca deve ter retornado um objeto com status
    expect(result).toBeUndefined();
  });

  it('createCreditCardPayment não retorna status approved simulado em produção', async () => {
    let result: unknown = undefined;
    try {
      result = await service.createCreditCardPayment(
        100,
        'Recarga',
        'user@prod.com',
        'token',
      );
    } catch {
      // esperado
    }
    expect(result).toBeUndefined();
  });
});
