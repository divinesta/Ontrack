import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getAdminHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'admin' }, 'Admin module is ready');
};
