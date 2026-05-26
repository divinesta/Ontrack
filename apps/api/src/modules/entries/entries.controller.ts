import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getEntriesHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'entries' }, 'Entries module is ready');
};
