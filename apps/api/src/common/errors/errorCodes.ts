export const ErrorCodes = {
   // Auth
   AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
   AUTH_TOKEN_MISSING: "AUTH_TOKEN_MISSING",
   AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
   AUTH_INSUFFICIENT_PERMISSIONS: "AUTH_INSUFFICIENT_PERMISSIONS",

   // Validation
   VALIDATION_FAILED: "VALIDATION_FAILED",

   // Resources
   RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
   RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
   RESOURCE_CONFLICT: "RESOURCE_CONFLICT",

   // Rate limiting
   RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

   // Server/system
   SERVER_ERROR: "SERVER_ERROR",
   SERVER_DATABASE_ERROR: "SERVER_DATABASE_ERROR",
   SERVER_EXTERNAL_SERVICE_ERROR: "SERVER_EXTERNAL_SERVICE_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
   [ErrorCodes.AUTH_UNAUTHORIZED]: "You are not authorized to access this resource",
   [ErrorCodes.AUTH_TOKEN_MISSING]: "Authentication token is required",
   [ErrorCodes.AUTH_TOKEN_INVALID]: "Invalid authentication token",
   [ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS]: "You do not have permission to perform this action",

   [ErrorCodes.VALIDATION_FAILED]: "Validation failed",

   [ErrorCodes.RESOURCE_NOT_FOUND]: "Resource not found",
   [ErrorCodes.RESOURCE_ALREADY_EXISTS]: "Resource already exists",
   [ErrorCodes.RESOURCE_CONFLICT]: "Resource conflict",

   [ErrorCodes.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",

   [ErrorCodes.SERVER_ERROR]: "Internal server error",
   [ErrorCodes.SERVER_DATABASE_ERROR]: "Database error occurred",
   [ErrorCodes.SERVER_EXTERNAL_SERVICE_ERROR]: "External service error",
};
