import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { validateBody, validateParams } from '@/middleware/validate';
import { MemoryController } from '@/modules/memory/memory.controller';
import { memoryCardIdSchema, memoryUpsertSchema } from '@/modules/memory/memory.schema';

const controller = new MemoryController();

export const memoryRouter = Router();

memoryRouter.get('/cards', auth, controller.list);
memoryRouter.post('/cards', auth, validateBody(memoryUpsertSchema), controller.upsert);
memoryRouter.delete('/cards/:id', auth, validateParams(memoryCardIdSchema), controller.remove);
