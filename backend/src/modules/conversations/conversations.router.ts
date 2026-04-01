import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validate';
import { ConversationsController } from '@/modules/conversations/conversations.controller';
import {
  conversationMessageSchema,
  conversationParamsSchema,
  conversationQuerySchema,
  conversationSwitchSchema,
} from '@/modules/conversations/conversations.schema';

const controller = new ConversationsController();

export const conversationsRouter = Router();

conversationsRouter.post('/', auth, validateBody(conversationSwitchSchema), controller.createOrSwitch);
conversationsRouter.get('/current', auth, controller.getCurrent);
conversationsRouter.get(
  '/:id/messages',
  auth,
  validateParams(conversationParamsSchema),
  validateQuery(conversationQuerySchema),
  controller.listMessages,
);
conversationsRouter.post(
  '/:id/messages',
  auth,
  validateParams(conversationParamsSchema),
  validateBody(conversationMessageSchema),
  controller.sendMessage,
);
