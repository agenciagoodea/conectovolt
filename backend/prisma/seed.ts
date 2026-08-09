import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../src/generated/client';

dotenv.config();

async function main() {
  const provider = process.env.DB_PROVIDER || 'sqlite';
  let prisma: PrismaClient;

  if (provider === 'sqlite') {
    const { PrismaLibSql } = await import('@prisma/adapter-libsql');
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    });
    prisma = new PrismaClient({ adapter });
  } else {
    const { PrismaMariaDb } = await import('@prisma/adapter-mariadb');
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
    prisma = new PrismaClient({ adapter });
  }

  console.log(`\n=== ConectoVolt Seed ===`);
  console.log(`Provider: ${provider}\n`);

  // ============================================================
  // 1. WIPE ALL DATA (respecting FK constraints)
  // ============================================================
  console.log('Wiping all existing data...');

  await prisma.$executeRaw`DELETE FROM platform_usage`;
  await prisma.$executeRaw`DELETE FROM subscriptions`;
  await prisma.$executeRaw`DELETE FROM plans`;
  await prisma.$executeRaw`DELETE FROM audit_logs`;
  await prisma.$executeRaw`DELETE FROM notifications`;
  await prisma.$executeRaw`DELETE FROM payments`;
  await prisma.$executeRaw`DELETE FROM commissions`;
  await prisma.$executeRaw`DELETE FROM transactions`;
  await prisma.$executeRaw`DELETE FROM wallets`;
  await prisma.$executeRaw`DELETE FROM charging_sessions`;
  await prisma.$executeRaw`DELETE FROM connectors`;
  await prisma.$executeRaw`DELETE FROM chargers`;
  await prisma.$executeRaw`DELETE FROM stations`;
  await prisma.$executeRaw`DELETE FROM tariffs`;
  await prisma.$executeRaw`DELETE FROM vehicles`;
  await prisma.$executeRaw`DELETE FROM users`;
  await prisma.$executeRaw`DELETE FROM companies`;

  console.log('All data wiped.\n');

  // ============================================================
  // 2. PASSWORD HASH
  // ============================================================
  const defaultPassword = 'Admin@123';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  // ============================================================
  // 3. USERS
  // ============================================================
  console.log('Creating users...');

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@conectovolt.com.br',
      phone: '+5511999999999',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`  [SUPER_ADMIN] ${superAdmin.email} / ${defaultPassword}`);

  const testCompany = await prisma.company.create({
    data: {
      name: 'Operadora Teste',
      document: '00000000000000',
      email: 'contato@operadorateste.com',
      phone: '+5511888888888',
      status: 'ACTIVE',
    },
  });
  console.log(`  [COMPANY] ${testCompany.name}`);

  const operator = await prisma.user.create({
    data: {
      name: 'Operador Teste',
      email: 'operador@conectovolt.com.br',
      phone: '+5511777777777',
      passwordHash,
      role: 'OPERATOR',
      companyId: testCompany.id,
    },
  });
  console.log(`  [OPERATOR] ${operator.email} / ${defaultPassword}`);

  const customer = await prisma.user.create({
    data: {
      name: 'Cliente Teste',
      email: 'cliente@conectovolt.com.br',
      phone: '+5511666666666',
      passwordHash,
      role: 'CUSTOMER',
    },
  });
  console.log(`  [CUSTOMER] ${customer.email} / ${defaultPassword}`);

  // ============================================================
  // 4. WALLET
  // ============================================================
  await prisma.wallet.create({
    data: { companyId: testCompany.id, balance: 0 },
  });
  console.log('\nWallet created');

  // ============================================================
  // 5. TARIFF
  // ============================================================
  const tariff = await prisma.tariff.create({
    data: {
      companyId: testCompany.id,
      name: 'Tarifa Padrao',
      pricePerKwh: 2.5,
      isActive: true,
    },
  });
  console.log(`Tariff: ${tariff.name} (R$ ${tariff.pricePerKwh}/kWh)`);

  // ============================================================
  // 6. PLANS
  // ============================================================
  const starterPlan = await prisma.plan.create({
    data: {
      name: 'Starter',
      description: 'Para pequenos operadores',
      price: 0,
      maxStations: 3,
      maxChargers: 5,
      maxUsers: 3,
    },
  });

  const professionalPlan = await prisma.plan.create({
    data: {
      name: 'Professional',
      description: 'Para operadores em crescimento',
      price: 299,
      maxStations: 20,
      maxChargers: 50,
      maxUsers: 20,
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'Para grandes redes',
      price: 999,
      maxStations: 100,
      maxChargers: 500,
      maxUsers: 100,
    },
  });
  console.log(`Plans: Starter, Professional, Enterprise`);

  // ============================================================
  // 7. SUBSCRIPTION (Starter for test company)
  // ============================================================
  await prisma.subscription.create({
    data: {
      companyId: testCompany.id,
      planId: starterPlan.id,
      status: 'ACTIVE',
    },
  });
  console.log(`Subscription: Starter -> ${testCompany.name}`);

  // ============================================================
  // SUMMARY
  // ============================================================
  const userCount = await prisma.user.count();
  const companyCount = await prisma.company.count();
  const tariffCount = await prisma.tariff.count();
  const planCount = await prisma.plan.count();

  console.log(`\n=== Seed Completed ===`);
  console.log(`  Users:    ${userCount}`);
  console.log(`  Companies: ${companyCount}`);
  console.log(`  Tariffs:  ${tariffCount}`);
  console.log(`  Plans:    ${planCount}`);
  console.log(`\nDefault credentials:`);
  console.log(`  admin@conectovolt.com.br    / Admin@123  (SUPER_ADMIN)`);
  console.log(`  operador@conectovolt.com.br / Admin@123  (OPERATOR)`);
  console.log(`  cliente@conectovolt.com.br  / Admin@123  (CUSTOMER)`);
  console.log('');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
