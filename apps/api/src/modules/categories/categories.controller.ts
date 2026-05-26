import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getCategoriesHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'categories' }, 'Categories module is ready');
};
