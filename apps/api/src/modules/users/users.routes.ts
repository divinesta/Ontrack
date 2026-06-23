import { Router, type Router as ExpressRouter } from 'express';
import { getCurrentuser, getUsersHealth } from './users.controller';
import { requireAuth } from '../../common/middleware';

export const usersRouter: ExpressRouter = Router();

usersRouter.get('/health', getUsersHealth);

usersRouter.get("/me", requireAuth, getCurrentuser);