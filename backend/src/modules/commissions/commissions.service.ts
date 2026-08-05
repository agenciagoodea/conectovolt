import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CommissionsService {
  private readonly logger = new Logger(CommissionsService.name);
  private readonly DEFAULT_COMMISSION = 5.00;

  constructor(private readonly prisma: PrismaService) {}

  async calculate(paymentId: string) {
    this.logger.log(`Calculating commission for payment ${paymentId}`);
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { session: { include: { station: true } } },
    });
    if (!payment) throw new Error('Payment not found');

    const station = payment.session.station;
    const platformAmount = (Number(payment.amount) * this.DEFAULT_COMMISSION) / 100;
    const operatorAmount = Number(payment.amount) - platformAmount;

    const commission = await this.prisma.commission.create({
      data: {
        paymentId,
        companyId: station.companyId,
        percentage: this.DEFAULT_COMMISSION,
        platformAmount,
        operatorAmount,
      },
    });

    await this.creditWallet(station.companyId, operatorAmount);

    return commission;
  }

  async findAll(companyId?: string) {
    return this.prisma.commission.findMany({
      where: companyId ? { companyId } : undefined,
      include: { payment: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWalletBalance(companyId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { companyId } });
    return { balance: wallet?.balance || 0 };
  }

  async requestWithdrawal(companyId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { companyId } });
    if (!wallet) throw new BadRequestException('Wallet not found');
    if (Number(wallet.balance) < amount) throw new BadRequestException('Insufficient balance');

    await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount,
        description: 'Saque solicitado',
      },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });

    this.logger.log(`Withdrawal of R$${amount} requested by company ${companyId}`);

    return { message: 'Withdrawal requested successfully', amount };
  }

  async getTransactions(companyId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { companyId } });
    if (!wallet) return [];

    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async creditWallet(companyId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { companyId } });
    if (!wallet) return;

    await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'CREDIT',
        amount,
        description: 'Receita de sessao de recarga',
      },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    this.logger.log(`Wallet credited: company=${companyId}, amount=R$${amount}`);
  }
}
