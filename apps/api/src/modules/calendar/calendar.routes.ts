import { Router, type Router as ExpressRouter } from 'express';
import { getCalendarHealth } from './calendar.controller';

export const calendarRouter: ExpressRouter = Router();

calendarRouter.get('/health', getCalendarHealth);
