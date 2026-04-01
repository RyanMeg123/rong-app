import type { NextFunction, Request, Response } from 'express';

import { RolesService } from '@/modules/roles/roles.service';
import { ok } from '@/utils/response';

export class RolesController {
  private readonly service = new RolesService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.list(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
