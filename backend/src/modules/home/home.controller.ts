import type { NextFunction, Request, Response } from 'express';

import { HomeService } from '@/modules/home/home.service';
import { ok } from '@/utils/response';

export class HomeController {
  private readonly service = new HomeService();

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.get(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
