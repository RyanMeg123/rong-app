import type { NextFunction, Request, Response } from 'express';

import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';
import { verifyAccessToken } from '@/utils/crypto';

export function auth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(ErrorCode.UNAUTHORIZED, '未登录或票据无效', 401));
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      isGuest: payload.isGuest,
    };

    return next();
  } catch {
    return next(new AppError(ErrorCode.TOKEN_EXPIRED, '登录已过期', 401));
  }
}
