import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getAuthHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'auth' }, 'Auth module is ready');
};
