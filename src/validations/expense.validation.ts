import { z } from 'zod';
import {EXPENSE_TYPE} from "../lib/constants";

export const expenseCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  title: z.string().max(255),
  amount: z.number().min(1),
  category: z.number().min(1).optional(),
  type: z.enum([EXPENSE_TYPE.CASH, EXPENSE_TYPE.BANK]),
  remarks: z.string().max(255).optional()
});
