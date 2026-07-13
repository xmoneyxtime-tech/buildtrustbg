import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";

if (!process.env.DATABASE_URL) {
  loadEnv({ path: ".env" });
  loadEnv({ path: ".env.local", override: true });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient.");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
