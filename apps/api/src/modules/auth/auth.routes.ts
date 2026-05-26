import { Router, type Router as ExpressRouter } from 'express';
import { getAuthHealth } from './auth.controller';

export const authRouter: ExpressRouter = Router();

authRouter.get('/health', getAuthHealth);
