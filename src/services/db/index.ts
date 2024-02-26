import { PrismaClient } from "@prisma/client";
import { Logger } from "../../utils/log";

export const k404 = -404;

export const kPrisma = new PrismaClient();

export const kDBLogger = Logger.create({ tag: "DB" });
export function runWithDB(main: () => Promise<void>) {
  main()
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
