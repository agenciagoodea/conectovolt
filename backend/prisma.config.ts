import "dotenv/config";
import { defineConfig } from "prisma/config";

const isMySQL = process.env["DB_PROVIDER"] === "mysql";
const schemaPath = isMySQL ? "prisma/schema.mysql.prisma" : "prisma/schema.prisma";

export default defineConfig({
  schema: schemaPath,
  migrations: {
    path: isMySQL ? "prisma/migrations_mysql" : "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "file:./prisma/dev.db",
  },
});
