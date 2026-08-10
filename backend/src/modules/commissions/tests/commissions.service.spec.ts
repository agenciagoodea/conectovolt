import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CommissionsService } from '../commissions.service';
import { PrismaService } from '../../../database/prisma.service';

describe('CommissionsService', () => {
  let service: CommissionsService;
  const transaction = jest.fn();
  const walletUpdateMany = jest.fn();
  const transactionCreate = jest.fn();
  const prisma = {
    wallet: { findUnique: jest.fn() },
    client: {
      $transaction: transaction,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CommissionsService);
    jest.clearAllMocks();
    transaction.mockImplementation(
      (
        callback: (tx: {
          wallet: { updateMany: typeof walletUpdateMany };
          transaction: { create: typeof transactionCreate };
        }) => Promise<unknown>,
      ) =>
        callback({
          wallet: { updateMany: walletUpdateMany },
          transaction: { create: transactionCreate },
        }),
    );
  });

  it('rejects zero and negative withdrawals before touching the database', async () => {
    await expect(service.requestWithdrawal('company-1', 0)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.requestWithdrawal('company-1', -10)).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.wallet.findUnique).not.toHaveBeenCalled();
  });

  it('debits the wallet and records the withdrawal atomically', async () => {
    prisma.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      balance: 100,
    });
    walletUpdateMany.mockResolvedValue({ count: 1 });

    await expect(
      service.requestWithdrawal('company-1', 25),
    ).resolves.toMatchObject({ amount: 25 });

    expect(walletUpdateMany).toHaveBeenCalledWith({
      where: { id: 'wallet-1', balance: { gte: 25 } },
      data: { balance: { decrement: 25 } },
    });
    expect(transactionCreate).toHaveBeenCalled();
  });
});
