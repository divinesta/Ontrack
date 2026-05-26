import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getTasksHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'tasks' }, 'Tasks module is ready');
};
