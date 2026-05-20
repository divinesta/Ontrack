import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors/AppError";
import { ErrorCodes, type ErrorCode } from "../errors/errorCodes";
import logger from "../utils/logger";

type ErrorResponse = {
   success: false;
   message: string;
   code: ErrorCode;
   requestId?: string;
   timestamp: string;
   errors?: Record<string, string[]>;
};

const formatZodErrors = (error: ZodError): Record<string, string[]> => {
   const errors: Record<string, string[]> = {};

   for (const issue of error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
      errors[path] ??= [];
      errors[path].push(issue.message);
   }

   return errors;
};

export const errorHandler = (err: Error | AppError, req: Request, res: Response, _next: NextFunction): void => {
   const isProduction = process.env.NODE_ENV === "production";

   let statusCode = 500;
   let code: ErrorCode = ErrorCodes.SERVER_ERROR;
   let message = isProduction ? "An unexpected error occurred. Please try again later" : err.message;
   let errors: Record<string, string[]> | undefined;

   if (err instanceof AppError) {
      statusCode = err.statusCode;
      code = err.code;
      message = err.message;

      if (err instanceof ValidationError) {
         errors = err.errors;
      }
   } else if (err instanceof ZodError) {
      statusCode = 400;
      code = ErrorCodes.VALIDATION_FAILED;
      message = "Validation failed";
      errors = formatZodErrors(err);
   }

   const logData = {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      code,
      message: err.message,
      userId: req.user?.id,
      ...(err instanceof AppError && err.details && { details: err.details }),
   };

   if (statusCode >= 500) {
      logger.error({ ...logData, stack: err.stack }, "Server error occurred");
   } else {
      logger.warn(logData, "Client error occurred");
   }

   const response: ErrorResponse = {
      success: false,
      message,
      code,
      requestId: req.id,
      timestamp: new Date().toISOString(),
      ...(errors && Object.keys(errors).length > 0 && { errors }),
   };

   res.status(statusCode).json(response);
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
   };
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
   if (req.originalUrl === "/favicon.ico") return;

   next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, ErrorCodes.RESOURCE_NOT_FOUND));
};

export default errorHandler;
