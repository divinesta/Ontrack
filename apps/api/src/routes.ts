import { Router, type Router as ExpressRouter } from 'express';
import { success } from './common/utils/response';
import { adminRouter } from './modules/admin/admin.routes';
import { authRouter } from './modules/auth/auth.routes';
import { billingRouter } from './modules/billing/billing.routes';
import { calendarRouter } from './modules/calendar/calendar.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { entriesRouter } from './modules/entries/entries.routes';
import { onboardingRouter } from './modules/onboarding/onboarding.routes';
import { reflectionsRouter } from './modules/reflections/reflections.routes';
import { remindersRouter } from './modules/reminders/reminders.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { usersRouter } from './modules/users/users.routes';

export const apiRouter: ExpressRouter = Router();

apiRouter.get('/health', (_req, res) => {
  return success(res, { status: 'ok' }, 'API is healthy');
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/onboarding', onboardingRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/entries', entriesRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/reflections', reflectionsRouter);
apiRouter.use('/calendar', calendarRouter);
apiRouter.use('/reminders', remindersRouter);
apiRouter.use('/billing', billingRouter);
apiRouter.use('/admin', adminRouter);
