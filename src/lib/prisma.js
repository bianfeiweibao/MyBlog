import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const databaseFile = join(currentDir, "../../Database.db");

const adapter = new PrismaBetterSqlite3({
  url: databaseFile,
});

export const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

