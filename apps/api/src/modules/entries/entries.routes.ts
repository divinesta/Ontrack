import { Router, type Router as ExpressRouter } from 'express';
import { getEntriesHealth } from './entries.controller';

export const entriesRouter: ExpressRouter = Router();

entriesRouter.get('/health', getEntriesHealth);
