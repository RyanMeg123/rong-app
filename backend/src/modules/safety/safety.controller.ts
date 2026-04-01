import type { NextFunction, Request, Response } from 'express';

import { SafetyService } from '@/modules/safety/safety.service';
import { ok } from '@/utils/response';

export class SafetyController {
  private readonly service = new SafetyService();

  boundary = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.boundary();
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
