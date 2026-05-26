import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getRemindersHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'reminders' }, 'Reminders module is ready');
};
