import * as Sentry from '@sentry/node';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ErrorCode, fail } from '@/utils/response';

export class AppError extends Error {
  constructor(
    public code: number,
    message: string,
    public httpStatus = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return fail(
      res,
      ErrorCode.VALIDATION_ERROR,
      err.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', '),
      400,
    );
  }

  if (err instanceof AppError) {
    return fail(res, err.code, err.message, err.httpStatus);
  }

  Sentry.captureException(err);
  return fail(res, ErrorCode.INTERNAL_ERROR, '服务器内部错误', 500);
}
