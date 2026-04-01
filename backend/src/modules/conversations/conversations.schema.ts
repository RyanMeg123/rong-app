import { z } from 'zod';

export const conversationSwitchSchema = z.object({
  roleId: z.string().uuid(),
  conversationId: z.string().uuid().nullable(),
});

export const conversationParamsSchema = z.object({
  id: z.string().uuid(),
});

export const conversationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export const conversationMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});
