import { Router } from 'express';

import { auth } from '@/middleware/auth';
import { HomeController } from '@/modules/home/home.controller';

const controller = new HomeController();

export const homeRouter = Router();

homeRouter.get('/', auth, controller.get);
