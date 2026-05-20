const SENSITIVE_FIELDS = new Set([
   "password",
   "passwordHash",
   "password_hash",
   "oldPassword",
   "newPassword",
   "confirmPassword",
   "otp",
   "token",
   "accessToken",
   "refreshToken",
   "access_token",
   "refresh_token",
   "api_key",
   "apiKey",
   "secret",
   "privateKey",
   "private_key",
   "authorization",
   "cookie",
   "set-cookie",
]);

const SENSITIVE_PATTERNS = [/Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, /[a-zA-Z0-9]{32,}/g];

export const redactString = (str: string): string => {
   let redacted = str;

   for (const pattern of SENSITIVE_PATTERNS) {
      redacted = redacted.replace(pattern, "[REDACTED]");
   }

   return redacted;
};

export const redactObject = (obj: unknown, maxDepth = 10): unknown => {
   if (maxDepth <= 0) return "[MAX_DEPTH_REACHED]";
   if (obj === null || obj === undefined) return obj;

   if (typeof obj !== "object") {
      return typeof obj === "string" ? redactString(obj) : obj;
   }

   if (Array.isArray(obj)) {
      return obj.map((item) => redactObject(item, maxDepth - 1));
   }

   const redacted: Record<string, unknown> = {};

   for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_FIELDS.has(key) || SENSITIVE_FIELDS.has(key.toLowerCase())) {
         redacted[key] = "[REDACTED]";
         continue;
      }

      redacted[key] = redactObject(value, maxDepth - 1);
   }

   return redacted;
};

export const redactRequestData = (data: { body?: unknown; query?: unknown; params?: unknown; headers?: unknown }) => {
   return {
      body: data.body ? redactObject(data.body) : undefined,
      query: data.query ? redactObject(data.query) : undefined,
      params: data.params ? redactObject(data.params) : undefined,
      headers: data.headers ? redactObject(data.headers) : undefined,
   };
};
