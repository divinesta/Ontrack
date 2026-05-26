import type { RequestHandler } from 'express';
import { success } from '../../common/utils/response';

export const getOnboardingHealth: RequestHandler = (_req, res) => {
  return success(res, { module: 'onboarding' }, 'Onboarding module is ready');
};
