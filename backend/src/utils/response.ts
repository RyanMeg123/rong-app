import type { Response } from 'express';

export const ErrorCode = {
  VALIDATION_ERROR: 40001,
  UNAUTHORIZED: 40100,
  TOKEN_EXPIRED: 40101,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  BINDING_CONFLICT: 40900,
  RATE_LIMITED: 42900,
  INTERNAL_ERROR: 50000,
} as const;

export function ok<T>(res: Response, data: T, meta?: Record<string, unknown>) {
  return res.status(200).json({
    code: 0,
    message: 'success',
    data,
    ...(meta ? { meta } : {}),
  });
}

export function fail(res: Response, code: number, message: string, status = 400) {
  return res.status(status).json({
    code,
    message,
    data: null,
  });
}
