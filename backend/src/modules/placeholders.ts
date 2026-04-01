import type { NextFunction, Request, Response } from 'express';

import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';

export function notImplemented(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(ErrorCode.INTERNAL_ERROR, '模块尚未实现', 501));
}
