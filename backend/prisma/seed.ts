const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const { PrismaClient } = await import('../src/generated/client.js');
  const provider = process.env.DB_PROVIDER || 'sqlite';
  let prisma;

  if (provider === 'sqlite') {
    const { PrismaLibSql } = await import('@prisma/adapter-libsql');
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    });
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient();
  }

  console.log(`Seeding database (${provider})...`);

  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const goodeaPasswordHash = await bcrypt.hash('04039866@AAs', 12);

  const superAdmin1 = await prisma.user.upsert({
    where: { email: 'admin@evcharge.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@evcharge.com',
      phone: '+5511999999999',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Super Admin 1: ${superAdmin1.email}`);

  const superAdmin2 = await prisma.user.upsert({
    where: { email: 'contato@agenciagoodea.com' },
    update: {},
    create: {
      name: 'Adriano Amorim Souza',
      email: 'contato@agenciagoodea.com',
      phone: '+5511988888888',
      passwordHash: goodeaPasswordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Super Admin 2: ${superAdmin2.email}`);

  const testCompany = await prisma.company.upsert({
    where: { document: '00000000000000' },
    update: {},
    create: {
      name: 'Operadora Teste',
      document: '00000000000000',
      email: 'contato@operadorateste.com',
      phone: '+5511888888888',
      status: 'ACTIVE',
    },
  });
  console.log(`Company: ${testCompany.name}`);

  await prisma.wallet.upsert({
    where: { companyId: testCompany.id },
    update: {},
    create: { companyId: testCompany.id, balance: 0 },
  });
  console.log('Wallet created');

  await prisma.tariff.upsert({
    where: { id: 'default-tariff' },
    update: {},
    create: {
      id: 'default-tariff',
      companyId: testCompany.id,
      name: 'Tarifa Padrao',
      pricePerKwh: 2.50,
      isActive: true,
    },
  });
  console.log('Tariff: R$ 2.50/kWh');

  console.log('Seed completed successfully!');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
