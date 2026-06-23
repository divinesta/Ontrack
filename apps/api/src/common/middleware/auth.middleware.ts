import type { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";
import { verifyAccessToken } from "../../modules/auth/auth.token";


export const requireAuth: RequestHandler = async (req, _res, next) => {
   const header = req.headers.authorization;

   if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing auth token", ErrorCodes.AUTH_TOKEN_MISSING)
   }

   const token = header.slice("Bearer ".length);
   const payload = await verifyAccessToken(token);

   req.user = { id: payload.userId };

   next();
}
