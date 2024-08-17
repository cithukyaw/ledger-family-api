import { z } from 'zod';
import {PAY_TYPE} from "../lib/constants";

export const expenseCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  title: z.string().max(255),
  amount: z.number().min(1),
  category: z.number().min(1).optional(),
  type: z.nativeEnum(PAY_TYPE),
  remarks: z.string().max(255).optional()
});
