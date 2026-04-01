import { z } from 'zod';

export const guestAuthSchema = z.object({
  deviceId: z.string().min(1),
  installSource: z.enum(['appstore', 'testflight', 'unknown']),
});

export const appleAuthSchema = z.object({
  identityToken: z.string().min(1),
  authorizationCode: z.string().min(1),
  guestAccessToken: z.string().nullable(),
});

export const emailRequestSchema = z.object({
  email: z.string().email(),
});

export const emailVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8),
  guestAccessToken: z.string().nullable(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});
