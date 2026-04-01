import type { NextFunction, Request, Response } from 'express';

import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(ErrorCode.NOT_FOUND, `资源不存在: ${req.method} ${req.originalUrl}`, 404));
}
