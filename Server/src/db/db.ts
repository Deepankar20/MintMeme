// src/lib/prisma.ts (or just prisma.ts at root)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // optional: useful during development
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
