import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { RolesController } from '@/modules/roles/roles.controller';

const controller = new RolesController();

export const rolesRouter = Router();

rolesRouter.get('/', auth, controller.list);
