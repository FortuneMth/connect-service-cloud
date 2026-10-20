import "dotenv/config";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

const databaseUrl = process.env.DATABASE_URL;

/**
 * PostgreSQL is configured only when DATABASE_URL is set.
 * Contract emit does not open a connection, so the schema can be validated
 * before a database exists.
 */
export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    ...(databaseUrl ? { db: { connection: databaseUrl } } : {}),
  }),
  skills: {
    check: false,
  },
});
