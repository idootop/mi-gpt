import { PrismaClient } from "@prisma/client";

export const k404 = -404;

export const kPrisma = new PrismaClient();

export function runWithDB(main: () => Promise<void>) {
  main()
    .then(async () => {
      await kPrisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
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
