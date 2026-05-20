import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { redactRequestData } from "../utils/redaction";

const SLOW_THRESHOLD_MS = 1000;

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
   const startTime = Date.now();

   req.wideEvent = {
      requestId: req.id,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
   };

   let emitted = false;
   const originalEnd = res.end;
   const originalJson = res.json;

   const emit = () => {
      if (emitted) return;
      emitted = true;

      const durationMs = Date.now() - startTime;
      const statusCode = res.statusCode;

      const event: Record<string, unknown> = {
         ...req.wideEvent,
         userId: req.user?.id,
         userRole: req.user?.role,
         statusCode,
         durationMs,
         ...(durationMs > SLOW_THRESHOLD_MS && { slow: true }),
      };

      const message = `${req.method} ${req.path} ${statusCode} [${durationMs}ms]`;

      if (statusCode >= 500) {
         logger.error(event, message);
      } else if (statusCode >= 400) {
         logger.warn(event, message);
      } else {
         logger.info(event, message);
      }
   };

   res.end = function (chunk?: unknown, encoding?: BufferEncoding | (() => void), callback?: () => void): Response {
      emit();
      return originalEnd.call(this, chunk, encoding as BufferEncoding, callback);
   };

   res.json = function (body?: unknown): Response {
      emit();
      return originalJson.call(this, body);
   };

   next();
};

export const sanitizeRequestForLogging = (req: Request) => {
   return redactRequestData({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
   });
};

export default requestLogger;
