import { Router, type Router as ExpressRouter } from 'express';
import { getTasksHealth } from './tasks.controller';

export const tasksRouter: ExpressRouter = Router();

tasksRouter.get('/health', getTasksHealth);
