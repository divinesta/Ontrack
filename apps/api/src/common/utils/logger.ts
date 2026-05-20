import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

export const logger = pino({
   level: logLevel,
   redact: {
      paths: [
         "password",
         "passwordHash",
         "password_hash",
         "otp",
         "token",
         "accessToken",
         "refreshToken",
         "authorization",
         "cookie",
         "req.headers.authorization",
         "req.headers.cookie",
         "res.headers[\"set-cookie\"]",
      ],
      censor: "[REDACTED]",
   },
   base: {
      env: process.env.NODE_ENV || "development",
      service: "ontrack-api",
   },
   timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export const createLogger = (context: Record<string, unknown>) => {
   return logger.child(context);
};

export default logger;
