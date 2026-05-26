import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getReflectionsHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'reflections' }, 'Reflections module is ready');
};
