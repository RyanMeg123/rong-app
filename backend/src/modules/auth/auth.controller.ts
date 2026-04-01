import type { NextFunction, Request, Response } from 'express';

import { ok } from '@/utils/response';
import { AuthService } from '@/modules/auth/auth.service';

export class AuthController {
  private readonly service = new AuthService();

  guest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.guest(req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  apple = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.apple(req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  requestEmailCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.requestEmailCode(req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  verifyEmailCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.verifyEmailCode(req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.refresh(req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.logout(req.user!.id, req.body);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };
}
