import type { NextFunction, Request, Response } from 'express';

import { PrivacyService } from '@/modules/privacy/privacy.service';
import { ok } from '@/utils/response';

export class PrivacyController {
  private readonly service = new PrivacyService();

  summary = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.summary();
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
