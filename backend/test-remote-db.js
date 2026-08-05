const mysql = require('mysql2/promise');

async function testConnection() {
  const hosts = ['pro122.dnspro.com.br', '186.209.113.109'];
  const user = 'kryontecnologic_root';
  const password = 'ZQ(~{Y?9de&;DqYA';
  const database = 'kryontecnologic_conectovolt';

  for (const host of hosts) {
    console.log(`Testing connection to ${host}...`);
    try {
      const connection = await mysql.createConnection({
        host,
        port: 3306,
        user,
        password,
        database,
        connectTimeout: 5000,
      });
      console.log(`SUCCESS! Connected to MySQL on ${host}`);
      const [rows] = await connection.execute('SHOW TABLES');
      console.log('Tables in database:', rows);
      await connection.end();
      return;
    } catch (err) {
      console.error(`Failed to connect to ${host}:`, err.message);
    }
  }
}

testConnection();
