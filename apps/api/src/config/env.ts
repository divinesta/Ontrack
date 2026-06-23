import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
   NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
   PORT: z.coerce.number().int().positive().default(4000),
   API_PREFIX: z.string().default("/api/v1"),

   CORS_ORIGIN: z.string().default("*"),

   DATABASE_URL: z.url(),

	WORKOS_API_KEY: z.string().min(1),
	WORKOS_CLIENT_ID: z.string().min(1),
	WORKOS_COOKIE_PASSWORD: z.string().min(32),
	WORKOS_REDIRECT_URI: z.url(),

	INFOBIP_BASE_URL: z.url(),
	INFOBIP_API_KEY: z.string().min(1),
	INFOBIP_FROM_EMAIL: z.email(),

	ONESIGNAL_APP_ID: z.string().min(1),
	ONESIGNAL_REST_API_KEY: z.string().min(1)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
   console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
   process.exit(1);
}

export const env = parsedEnv.data;
