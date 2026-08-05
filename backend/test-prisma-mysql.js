const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  console.log('Connecting to remote MySQL via @prisma/client...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });
  
  try {
    await prisma.$connect();
    console.log('SUCCESS! Prisma connected to remote MySQL.');

    const userCount = await prisma.user.count();
    console.log(`Total users in remote DB: ${userCount}`);

    const companyCount = await prisma.company.count();
    console.log(`Total companies in remote DB: ${companyCount}`);

    const stationCount = await prisma.station.count();
    console.log(`Total stations in remote DB: ${stationCount}`);
    
    await prisma.$disconnect();
  } catch (err) {
    console.error('Prisma connection error:', err);
  }
}

main();
