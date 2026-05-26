import { Router, type Router as ExpressRouter } from 'express';
import { getAdminHealth } from './admin.controller';

export const adminRouter: ExpressRouter = Router();

adminRouter.get('/health', getAdminHealth);
