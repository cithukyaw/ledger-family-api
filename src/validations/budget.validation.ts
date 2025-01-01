import { z } from 'zod';

export const budgetUpsertSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  ledgerId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  amount: z.number(),
});
