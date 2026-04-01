import { z } from 'zod';

export const updateMeSchema = z.object({
  nickname: z.string().max(50).nullable(),
  avatarUrl: z.string().url().nullable(),
});

export const deleteMeSchema = z.object({
  confirm: z.literal(true),
});

export const roleSelectionSchema = z.object({
  roleId: z.string().uuid(),
});
