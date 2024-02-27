import { PrismaClient } from "@prisma/client";
import { Logger } from "../../utils/log";
import { deleteFile, exists } from "../../utils/io";
import { Shell } from "../../utils/shell";

export const k404 = -404;

export const kPrisma = new PrismaClient();

export const kDBLogger = Logger.create({ tag: "database" });
export function runWithDB(main: () => Promise<void>) {
  return main()
    .then(async () => {
      await kPrisma.$disconnect();
    })
    .catch(async (e) => {
      kDBLogger.error(e);
      await kPrisma.$disconnect();
      process.exit(1);
    });
}

export function getSkipWithCursor(skip: number, cursorId: any) {
  return {
    skip: cursorId ? skip + 1 : skip,
    cursor: cursorId ? { id: cursorId } : undefined,
  };
}

export async function initDB() {
  const isExternal = exists("node_modules/mi-gpt/prisma");
  const dbPath = isExternal
    ? "node_modules/mi-gpt/prisma/app.db"
    : "prisma/app.db";
  if (!exists(dbPath)) {
    const withSchema = isExternal
      ? "--schema node_modules/mi-gpt/prisma/schema.prisma"
      : "";
    await deleteFile(".bot.json");
    await Shell.run(`npx prisma migrate dev --name init ${withSchema}`, {
      silent: true,
    });
  }
  const success = exists(dbPath);
  kDBLogger.assert(success, "初始化数据库失败！");
}
