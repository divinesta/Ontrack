import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getBillingHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'billing' }, 'Billing module is ready');
};
