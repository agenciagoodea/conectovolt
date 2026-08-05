const bcrypt = require('bcrypt');

async function main() {
  const [{ PrismaClient }, { PrismaLibSql }] = await Promise.all([
    import('../src/generated/client.js'),
    import('@prisma/adapter-libsql'),
  ]);

  const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' });
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database (SQLite)...');

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const superAdmin = await prisma.user.upsert({
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

  console.log(`Super Admin: ${superAdmin.email}`);

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
  console.log('Seed completed!');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
