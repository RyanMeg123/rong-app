import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { MeController } from '@/modules/me/me.controller';
import { deleteMeSchema, roleSelectionSchema, updateMeSchema } from '@/modules/me/me.schema';

const controller = new MeController();

export const meRouter = Router();

meRouter.get('/', auth, controller.getCurrent);
meRouter.patch('/', auth, validateBody(updateMeSchema), controller.updateCurrent);
meRouter.delete('/', auth, validateBody(deleteMeSchema), controller.deleteCurrent);
meRouter.post('/role', auth, validateBody(roleSelectionSchema), controller.selectRole);
meRouter.get('/role-state', auth, controller.getRoleState);
