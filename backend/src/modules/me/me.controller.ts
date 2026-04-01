import type { NextFunction, Request, Response } from 'express';

import { MeService } from '@/modules/me/me.service';
import { ok } from '@/utils/response';

export class MeController {
  private readonly service = new MeService();

  getCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getCurrent(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  updateCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.updateCurrent(req.user!.id, req.body);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  deleteCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.deleteCurrent(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  selectRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.selectRole(req.user!.id, req.body);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  getRoleState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getRoleState(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
