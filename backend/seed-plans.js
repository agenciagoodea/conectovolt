const { PrismaClient } = require('./dist/src/generated/client.js');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
  const prisma = new PrismaClient({ adapter });

  await prisma.plan.createMany({
    data: [
      { name: 'Starter', description: 'Para pequenos operadores', price: 0, maxStations: 3, maxChargers: 5, maxUsers: 3 },
      { name: 'Professional', description: 'Para operadores em crescimento', price: 299, maxStations: 20, maxChargers: 50, maxUsers: 20 },
      { name: 'Enterprise', description: 'Para grandes redes', price: 999, maxStations: 100, maxChargers: 500, maxUsers: 100 },
    ],
    skipDuplicates: true,
  });

  const company = await prisma.company.findFirst();
  const plan = await prisma.plan.findFirst({ where: { name: 'Starter' } });
  if (company && plan) {
    await prisma.subscription.upsert({
      where: { companyId: company.id },
      update: {},
      create: { companyId: company.id, planId: plan.id, status: 'ACTIVE' },
    });
  }

  console.log('Planos criados:', (await prisma.plan.findMany()).map(p => p.name));
  await prisma.$disconnect();
}

main();
