import type { RequestHandler } from 'express';
import { sendSuccess } from '../../common/http/response';

export const getTasksHealth: RequestHandler = (_req, res) => {
  return sendSuccess({
    res,
    message: 'Tasks module is ready',
    data: {
      module: 'tasks',
    },
  });
};
