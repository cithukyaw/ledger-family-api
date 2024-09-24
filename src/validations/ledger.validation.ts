import { z } from 'zod';

export const ledgerCreateSchema = z.object({
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  current: z.number(),
  income: z.number(),
  parentSupport: z.number(),
  budget: z.number()
});
