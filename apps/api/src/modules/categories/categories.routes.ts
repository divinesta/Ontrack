import { Router, type Router as ExpressRouter } from 'express';
import { getCategoriesHealth } from './categories.controller';

export const categoriesRouter: ExpressRouter = Router();

categoriesRouter.get('/health', getCategoriesHealth);
