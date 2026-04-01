import { Router } from 'express';

import { HealthController } from '@/modules/health/health.controller';

const controller = new HealthController();

export const healthRouter = Router();

healthRouter.get('/', controller.get);
