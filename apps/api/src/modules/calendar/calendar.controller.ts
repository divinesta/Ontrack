import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getCalendarHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'calendar' }, 'Calendar module is ready');
};
