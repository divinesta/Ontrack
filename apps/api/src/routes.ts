import { Router, type Router as ExpressRouter } from 'express';
import { tasksRouter } from './modules/tasks/tasks.routes';

export const apiRouter: ExpressRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'ok',
    },
  });
});

apiRouter.use('/tasks', tasksRouter);
