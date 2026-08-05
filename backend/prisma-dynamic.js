let PrismaClientClass: any;
let PrismaPgClass: any;

async function loadPrisma() {
  if (PrismaClientClass) return;

  const clientModule = await import('./src/generated/client.js');
  PrismaClientClass = clientModule.PrismaClient;

  const adapterModule = await import('@prisma/adapter-pg');
  PrismaPgClass = adapterModule.PrismaPg;
}

export { PrismaClientClass as PrismaClient, PrismaPgClass as PrismaPg, loadPrisma };
