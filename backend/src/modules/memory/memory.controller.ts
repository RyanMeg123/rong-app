import type { NextFunction, Request, Response } from 'express';

import { MemoryService } from '@/modules/memory/memory.service';
import { ok } from '@/utils/response';

export class MemoryController {
  private readonly service = new MemoryService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.list(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.upsert(req.user!.id, req.body);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.remove(req.user!.id, String(req.params.id));
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
