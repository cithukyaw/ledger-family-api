import { z } from 'zod';
import {PAY_TYPE} from "../lib/constants";

export const expenseCreateSchema = z.object({
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  title: z.string().max(255),
  amount: z.number().min(1),
  category: z.number().min(1).optional(),
  type: z.nativeEnum(PAY_TYPE),
  remarks: z.string().max(255).optional()
});

export const expenseFilterSchema = z.object({
  userId: z.number(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  to: z.string().regex(/^\d{4}-\d{2}/),
  category: z.number().array().optional(),
  paymentType: z.string().optional(),
  keyword: z.string().optional(),
})

export const singleExpenseSchema = z.object({
  id: z.number()
});
