import { Router, type Router as ExpressRouter } from 'express';
import { getUsersHealth } from './users.controller';

export const usersRouter: ExpressRouter = Router();

usersRouter.get('/health', getUsersHealth);
