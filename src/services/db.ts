import { PrismaClient } from "@prisma/client";

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
