import express from 'express';

import { env } from '@/config/env';
import { authRouter } from '@/modules/auth/auth.router';
import { conversationsRouter } from '@/modules/conversations/conversations.router';
import { homeRouter } from '@/modules/home/home.router';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFound';
import { requestLogger } from '@/middleware/requestLogger';
import { healthRouter } from '@/modules/health/health.router';
import { memoryRouter } from '@/modules/memory/memory.router';
import { meRouter } from '@/modules/me/me.router';
import { privacyRouter } from '@/modules/privacy/privacy.router';
import { rolesRouter } from '@/modules/roles/roles.router';
import { safetyRouter } from '@/modules/safety/safety.router';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestLogger);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));

  app.use(`/api/${env.API_VERSION}/health`, healthRouter);
  app.use(`/api/${env.API_VERSION}/auth`, authRouter);
  app.use(`/api/${env.API_VERSION}/me`, meRouter);
  app.use(`/api/${env.API_VERSION}/roles`, rolesRouter);
  app.use(`/api/${env.API_VERSION}/home`, homeRouter);
  app.use(`/api/${env.API_VERSION}/conversations`, conversationsRouter);
  app.use(`/api/${env.API_VERSION}/memory`, memoryRouter);
  app.use(`/api/${env.API_VERSION}/privacy`, privacyRouter);
  app.use(`/api/${env.API_VERSION}/safety`, safetyRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
