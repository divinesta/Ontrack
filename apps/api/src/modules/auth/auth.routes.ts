import { Router, type Router as ExpressRouter } from "express";
import { getAuthHealth, handleCallback, startLogin } from "./auth.controller";
import { validateQuery } from "../../common/middleware";
import { authCallbackQuerySchema } from "./auth.schema";

export const authRouter: ExpressRouter = Router();

authRouter.get("/health", getAuthHealth);

authRouter.get("/login", startLogin);

authRouter.get("/callback", validateQuery(authCallbackQuerySchema), handleCallback);