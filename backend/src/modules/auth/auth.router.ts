import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { AuthController } from '@/modules/auth/auth.controller';
import {
  appleAuthSchema,
  emailRequestSchema,
  emailVerifySchema,
  guestAuthSchema,
  logoutSchema,
  refreshSchema,
} from '@/modules/auth/auth.schema';

const controller = new AuthController();

export const authRouter = Router();

authRouter.post('/guest', validateBody(guestAuthSchema), controller.guest);
authRouter.post('/apple', validateBody(appleAuthSchema), controller.apple);
authRouter.post('/email/request-code', validateBody(emailRequestSchema), controller.requestEmailCode);
authRouter.post('/email/verify-code', validateBody(emailVerifySchema), controller.verifyEmailCode);
authRouter.post('/refresh', validateBody(refreshSchema), controller.refresh);
authRouter.post('/logout', auth, validateBody(logoutSchema), controller.logout);
