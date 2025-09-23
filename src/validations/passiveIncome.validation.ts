import { z } from 'zod';

export const passiveIncomeCreateSchema = z.object({
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  title: z.string().max(255),
  amount: z.number().min(1),
  type: z.string().max(10).optional(),
});

export const passiveIncomeFilterSchema = z.object({
  userId: z.number(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  to: z.string().regex(/^\d{4}-\d{2}/),
  keyword: z.string().optional(),
})

export const singlePassiveIncomeSchema = z.object({
  id: z.number()
});