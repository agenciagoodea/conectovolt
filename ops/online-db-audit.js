const path = require('path');
const dotenv = require('../backend/node_modules/dotenv');
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [tables] = await connection.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name',
    );
    const [commissionColumn] = await connection.query(
      "SELECT COUNT(*) AS present FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name='companies' AND column_name='commission_percent'",
    );
    const [migrationTable] = await connection.query(
      "SELECT COUNT(*) AS present FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name='_prisma_migrations'",
    );
    let migrations = [];
    if (Number(migrationTable[0].present)) {
      const [rows] = await connection.query(
        'SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at',
      );
      migrations = rows;
    }

    console.log(
      JSON.stringify({
        tables: tables.map((table) => table.TABLE_NAME || table.table_name),
        commissionPercent: Number(commissionColumn[0].present) === 1,
        migrations,
      }),
    );
  } finally {
    if (connection) await connection.end();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ error: error.code || error.message }));
  process.exitCode = 1;
});
