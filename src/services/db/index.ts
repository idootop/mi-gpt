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

export function getDBInfo() {
  let rootDir = import.meta.url
    .replace("/dist/index.js", "")
    .replace("/dist/index.cjs", "")
    .replace("/src/services/db/index.ts", "")
    .replace("file:///", "");
  if (rootDir[1] !== ":") {
    rootDir = "/" + rootDir; // linux root path
  }
  const dbPath = rootDir + "/prisma/app.db";
  const withSchema = `--schema ${rootDir}/prisma/schema.prisma`;
  return { dbPath, withSchema };
}

export async function initDB(debug = false) {
  const { dbPath, withSchema } = getDBInfo();
  if (!exists(dbPath)) {
    await deleteFile(".bot.json");
    await Shell.run(`npx prisma migrate dev --name init ${withSchema}`, {
      silent: debug ? false : true,
    });
  }
  const success = exists(dbPath);
  kDBLogger.assert(success, "初始化数据库失败！");
}
