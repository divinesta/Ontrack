import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z, type ZodSchema, type ZodTypeAny, ZodError } from "zod";
import { ValidationError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";

const ensureValidated = (req: Request): void => {
   if (!req.validated) {
      req.validated = {
         body: {},
         query: {},
         params: {},
      };
   }
};

export const formatZodErrors = (error: ZodError): Record<string, string[]> => {
   const errors: Record<string, string[]> = {};

   for (const issue of error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
      errors[path] ??= [];
      errors[path].push(issue.message);
   }

   return errors;
};

export const getValidationSummary = (errors: Record<string, string[]>): string => {
   const fieldCount = Object.keys(errors).length;
   const errorCount = Object.values(errors).flat().length;

   if (fieldCount === 1) {
      const field = Object.keys(errors)[0];
      return field === "_root" ? errors[field]?.[0] ?? "Validation failed" : `Validation failed for field: ${field}`;
   }

   return `Validation failed for ${fieldCount} fields (${errorCount} errors)`;
};

export const validate = <T extends ZodTypeAny>(schema: T): RequestHandler => {
   return (req: Request, _res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
         const errors = formatZodErrors(result.error);
         throw new ValidationError(getValidationSummary(errors), errors, ErrorCodes.VALIDATION_FAILED);
      }

      ensureValidated(req);
      req.validated.body = result.data;
      req.body = result.data;

      next();
   };
};

export const validateBody = validate;

export const validateQuery = <T extends ZodTypeAny>(schema: T): RequestHandler => {
   return (req: Request, _res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.query);

      if (!result.success) {
         const errors = formatZodErrors(result.error);
         throw new ValidationError(`Invalid query parameters: ${getValidationSummary(errors)}`, errors, ErrorCodes.VALIDATION_FAILED);
      }

      ensureValidated(req);
      req.validated.query = result.data;

      next();
   };
};

export const validateParams = <T extends ZodTypeAny>(schema: T): RequestHandler => {
   return (req: Request, _res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.params);

      if (!result.success) {
         const errors = formatZodErrors(result.error);
         throw new ValidationError(`Invalid URL parameters: ${getValidationSummary(errors)}`, errors, ErrorCodes.VALIDATION_FAILED);
      }

      ensureValidated(req);
      req.validated.params = result.data;

      next();
   };
};

export const validateRequest = (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }): RequestHandler => {
   return (req: Request, _res: Response, next: NextFunction) => {
      const errors: Record<string, string[]> = {};
      ensureValidated(req);

      if (schemas.params) {
         const result = schemas.params.safeParse(req.params);
         if (!result.success) {
            const paramErrors = formatZodErrors(result.error);
            for (const [key, value] of Object.entries(paramErrors)) errors[`params.${key}`] = value;
         } else {
            req.validated.params = result.data;
         }
      }

      if (schemas.query) {
         const result = schemas.query.safeParse(req.query);
         if (!result.success) {
            const queryErrors = formatZodErrors(result.error);
            for (const [key, value] of Object.entries(queryErrors)) errors[`query.${key}`] = value;
         } else {
            req.validated.query = result.data;
         }
      }

      if (schemas.body) {
         const result = schemas.body.safeParse(req.body);
         if (!result.success) {
            Object.assign(errors, formatZodErrors(result.error));
         } else {
            req.validated.body = result.data;
            req.body = result.data;
         }
      }

      if (Object.keys(errors).length > 0) {
         throw new ValidationError(getValidationSummary(errors), errors, ErrorCodes.VALIDATION_FAILED);
      }

      next();
   };
};

export const cuidParam = (paramName = "id") =>
   z.object({
      [paramName]: z.cuid2(`Invalid ${paramName} format`),
   });

export const paginationQuery = z.object({
   page: z.coerce.number().int().min(1).default(1),
   limit: z.coerce.number().int().min(1).max(100).default(20),
   sortBy: z.string().optional(),
   sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchQuery = paginationQuery.extend({
   search: z.string().optional(),
   q: z.string().optional(),
});

export const booleanQuery = z
   .string()
   .transform((val) => val === "true" || val === "1")
   .or(z.boolean());

export const optionalBooleanQuery = booleanQuery.optional();
export const dateString = z.iso.datetime().pipe(z.coerce.date());
export const optionalDateString = dateString.optional().nullable();
export const emailSchema = z.email("Invalid email format").toLowerCase().trim();
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
