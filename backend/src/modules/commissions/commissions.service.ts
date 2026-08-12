import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CommissionsService {
  private readonly logger = new Logger(CommissionsService.name);
  private readonly DEFAULT_COMMISSION = 5.0;

  constructor(private readonly prisma: PrismaService) {}

  async calculate(paymentId: string, outerTx?: any) {
    this.logger.log(`Calculating commission for payment ${paymentId}`);

    const runInTx = async (tx: any) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          session: { include: { station: { include: { company: true } } } },
        },
      });
      if (!payment) throw new Error('Payment not found');

      const station = payment.session.station;
      const percentage = Number(
        payment.session.station.company.commissionPercent ??
          this.DEFAULT_COMMISSION,
      );
      const platformAmount = (Number(payment.amount) * percentage) / 100;
      const operatorAmount = Number(payment.amount) - platformAmount;

      const existingCommission = await tx.commission.findUnique({
        where: { paymentId },
      });
      if (existingCommission) {
        return existingCommission;
      }
      const commission = await tx.commission.create({
        data: {
          paymentId,
          companyId: station.companyId,
          percentage,
          platformAmount,
          operatorAmount,
        },
      });

      const wallet = await tx.wallet.findUnique({
        where: { companyId: station.companyId },
      });
      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'CREDIT',
          amount: operatorAmount,
          description: 'Receita de sessao de recarga',
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: operatorAmount } },
      });

      return commission;
    };

    if (outerTx) {
      return runInTx(outerTx);
    }
    return this.prisma.client.$transaction(runInTx);
  }

  async findAll(companyId?: string) {
    return this.prisma.commission.findMany({
      where: companyId ? { companyId } : undefined,
      include: { payment: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWalletBalance(companyId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { companyId },
    });
    return { balance: wallet?.balance || 0 };
  }

  async requestWithdrawal(companyId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be greater than zero',
      );
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { companyId },
    });
    if (!wallet) throw new BadRequestException('Wallet not found');
    if (Number(wallet.balance) < amount)
      throw new BadRequestException('Insufficient balance');

    await this.prisma.client.$transaction(async (tx) => {
      // The conditional update prevents two concurrent withdrawals from
      // spending the same wallet balance.
      const updated = await tx.wallet.updateMany({
        where: { id: wallet.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      });

      if (updated.count !== 1) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount,
          description: 'Saque solicitado',
        },
      });
    });

    this.logger.log(
      `Withdrawal of R$${amount} requested by company ${companyId}`,
    );

    return { message: 'Withdrawal requested successfully', amount };
  }

  async getTransactions(companyId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { companyId },
    });
    if (!wallet) return [];

    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
