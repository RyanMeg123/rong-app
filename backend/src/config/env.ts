import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_VERSION: z.string().min(2).default('v1'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).optional().or(z.literal('')),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  SENTRY_DSN: z.string().optional().or(z.literal('')),
  CORS_ORIGIN: z.string().optional().or(z.literal('')),
});

export const env = envSchema.parse(process.env);
