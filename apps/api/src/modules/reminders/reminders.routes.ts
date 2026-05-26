import { Router, type Router as ExpressRouter } from 'express';
import { getRemindersHealth } from './reminders.controller';

export const remindersRouter: ExpressRouter = Router();

remindersRouter.get('/health', getRemindersHealth);
