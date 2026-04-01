import type { NextFunction, Request, Response } from 'express';

import { ConversationsService } from '@/modules/conversations/conversations.service';
import { ok } from '@/utils/response';

export class ConversationsController {
  private readonly service = new ConversationsService();

  createOrSwitch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createOrSwitch(req.user!.id, req.body);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  getCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getCurrent(req.user!.id);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  listMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.listMessages(req.user!.id, String(req.params.id), req.query);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.sendMessage(req.user!.id, String(req.params.id), req.body);
      return ok(res, data);
    } catch (error) {
      return next(error);
    }
  };
}
