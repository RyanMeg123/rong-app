import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { SendCommandFn } from 'rate-limit-redis/dist/index';

import { redis } from '@/config/redis';
import { ErrorCode } from '@/utils/response';

export function createRateLimit(windowMs: number, max: number) {
  const redisClient = redis;
  const store =
    redisClient === null
      ? undefined
      : new RedisStore({
          sendCommand: ((...args: string[]) =>
            redisClient.call(args[0], ...args.slice(1))) as SendCommandFn,
        });

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    message: {
      code: ErrorCode.RATE_LIMITED,
      message: '请求过于频繁',
      data: null,
    },
  });
}
