import { type ErrorCode, ErrorMessages } from "./errorCodes";

export class AppError extends Error {
   public readonly statusCode: number;
   public readonly code: ErrorCode;
   public readonly details?: Record<string, unknown>;
   public readonly timestamp: string;

   constructor(message: string, statusCode: number, code: ErrorCode, details?: Record<string, unknown>) {
      super(message);

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, this.constructor);
      }

      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.code = code;
      this.details = details;
      this.timestamp = new Date().toISOString();

      // Ensures the error is an instance of AppError
      Object.setPrototypeOf(this, new.target.prototype);
   }
}

/**
 * 400 Bad Request
 * Client sent invalid data or request
 */
export class BadRequestError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 400, code, details);
   }
}

/**
 * 401 Unauthorized
 * Authentication required or failed
 */
export class UnauthorizedError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 401, code, details);
   }
}

/**
 * 403 Forbidden
 * User authenticated but lacks permissions
 */
export class ForbiddenError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 403, code, details);
   }
}

/**
 * 404 Not Found
 * Resource does not exist
 */
export class NotFoundError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 404, code, details);
   }
}

/**
 * 409 Conflict
 * Resource already exists or conflicts with current state
 */
export class ConflictError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 409, code, details);
   }
}

/**
 * 422 Unprocessable Entity
 * Request well-formed but semantically invalid
 */
export class UnprocessableEntityError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 422, code, details);
   }
}

/**
 * 429 Too Many Requests
 * Rate limit exceeded
 */
export class TooManyRequestsError extends AppError {
   constructor(
      message: string,
      code: ErrorCode,
      public readonly retryAfter?: number,
      public readonly limit?: number,
      public readonly remaining?: number,
      details?: Record<string, unknown>,
   ) {
      super(message, 429, code, details);
   }
}

/**
 * 500 Internal Server Error
 * Unexpected server error (programmer errors)
 */
export class InternalServerError extends AppError {
   constructor(message: string = "An unexpected error occurred", code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 500, code, details);
   }
}

/**
 * 503 Service Unavailable
 * External service or database unavailable
 */
export class ServiceUnavailableError extends AppError {
   constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
      super(message, 503, code, details);
   }
}

/**
 * Validation Error (400)
 * Field-level validation failures
 */
export class ValidationError extends BadRequestError {
   constructor(
      message: string = "Validation failed",
      public readonly errors: Record<string, string[]>,
      code: ErrorCode = "VALIDATION_FAILED" as ErrorCode,
   ) {
      super(message, code, { errors });
   }
}

// SPECIALIZED ERROR CLASSES (Domain-Specific)

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends UnauthorizedError {
   constructor(code: ErrorCode = "AUTH_INVALID_CREDENTIALS" as ErrorCode, message?: string) {
      super(message || ErrorMessages[code], code);
   }
}
