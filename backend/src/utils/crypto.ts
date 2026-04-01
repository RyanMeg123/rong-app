import { createHash } from 'node:crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import { env } from '@/config/env';

type AccessTokenPayload = {
  sub: string;
  isGuest: boolean;
};

export function signAccessToken(payload: AccessTokenPayload) {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    ...options,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(userId: string) {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    ...options,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
}

export async function hashValue(value: string) {
  return bcrypt.hash(value, 10);
}

export async function compareValue(value: string, hashedValue: string) {
  return bcrypt.compare(value, hashedValue);
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
