import { z } from 'zod';

export const memoryUpsertSchema = z.object({
  memoryType: z.string().min(1).max(50),
  memoryKey: z.string().min(1).max(100),
  memoryValue: z.string().min(1),
  consentScope: z.string().min(1).max(30),
});

export const memoryCardIdSchema = z.object({
  id: z.string().uuid(),
});
