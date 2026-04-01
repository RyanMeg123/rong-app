import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { SafetyController } from '@/modules/safety/safety.controller';

const controller = new SafetyController();

export const safetyRouter = Router();

safetyRouter.get('/boundary', auth, controller.boundary);
