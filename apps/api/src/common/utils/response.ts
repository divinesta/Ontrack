import type { Response } from "express";
import type { ApiResponse, PaginatedResponse } from "../types";

export const success = <T>(res: Response, data?: T, message?: string, statusCode = 200): Response => {
   const response: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
   };

   return res.status(statusCode).json(response);
};

export const created = <T>(res: Response, data: T, message = "Resource created successfully"): Response => {
   return success(res, data, message, 201);
};

export const noContent = (res: Response): Response => {
   return res.status(204).send();
};

export const paginated = <T>(res: Response, data: T[], total: number, page: number, limit: number, message?: string): Response => {
   const totalPages = Math.ceil(total / limit);

   const response: ApiResponse<PaginatedResponse<T>> = {
      success: true,
      ...(message && { message }),
      data: {
         data,
         meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
         },
      },
   };

   return res.status(200).json(response);
};

export const buildResponse = <T>(data?: T, message?: string): ApiResponse<T> => {
   return {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
   };
};
