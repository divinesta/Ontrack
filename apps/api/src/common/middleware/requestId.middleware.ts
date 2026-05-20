import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
   const existingId = req.headers["x-request-id"];
   const requestId = typeof existingId === "string" && existingId.length > 0 ? existingId : `req_${randomUUID()}`;

   req.id = requestId;
   res.setHeader("X-Request-ID", requestId);

   next();
};
