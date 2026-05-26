import { Router, type Router as ExpressRouter } from 'express';
import { getOnboardingHealth } from './onboarding.controller';

export const onboardingRouter: ExpressRouter = Router();

onboardingRouter.get('/health', getOnboardingHealth);
