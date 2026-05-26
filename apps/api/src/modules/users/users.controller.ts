import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getUsersHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'users' }, 'Users module is ready');
};
