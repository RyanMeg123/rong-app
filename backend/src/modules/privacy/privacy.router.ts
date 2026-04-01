import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { PrivacyController } from '@/modules/privacy/privacy.controller';

const controller = new PrivacyController();

export const privacyRouter = Router();

privacyRouter.get('/summary', auth, controller.summary);
