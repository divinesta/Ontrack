import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { logger } from "../common/utils/logger";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
   throw new Error("DATABASE_URL not set.");
}

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
   try {
      // Test the connection
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

// Graceful shutdown
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

// Handle process termination
process.on("SIGINT", disconnectDB);
process.on("SIGTERM", disconnectDB);

export { prisma, connectDB, disconnectDB };
export default prisma;
