import { Router, type Router as ExpressRouter } from 'express';
import { getReflectionsHealth } from './reflections.controller';

export const reflectionsRouter: ExpressRouter = Router();

reflectionsRouter.get('/health', getReflectionsHealth);
