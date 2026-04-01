import Redis from 'ioredis';

import { env } from '@/config/env';

const globalForRedis = globalThis as unknown as {
  redis?: Redis | null;
};

export const redis =
  globalForRedis.redis ??
  (env.REDIS_URL ? new Redis(env.REDIS_URL, { lazyConnect: true }) : null);

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
