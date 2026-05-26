import { Router, type Router as ExpressRouter } from 'express';
import { getBillingHealth } from './billing.controller';

export const billingRouter: ExpressRouter = Router();

billingRouter.get('/health', getBillingHealth);
