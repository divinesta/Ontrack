import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "../common/utils/logger";
import { env } from "./env";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
   try {
      await prisma.$connect();
      logger.info("PostgreSQL Connected via Prisma");
   } catch (error) {
      if (error instanceof Error) {
         logger.error(`PostgreSQL connection error: ${error.message}`);
      } else {
         logger.error(`PostgreSQL connection error: Unknown error: ${error}`);
      }
      process.exit(1);
   }
};

const disconnectDB = async () => {
   try {
      await prisma.$disconnect();
      await pool.end();
      logger.info("PostgreSQL Disconnected");
   } catch (error) {
      if (error instanceof Error) {
         logger.error(`PostgreSQL disconnection error: ${error.message}`);
      }
   }
};

export const registerDatabaseShutdown = (): void => {
   process.on("SIGINT", disconnectDB);
   process.on("SIGTERM", disconnectDB);
};

export { prisma, connectDB, disconnectDB };
export default prisma;
