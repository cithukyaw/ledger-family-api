import { z } from 'zod';
import {CURRENCY} from "../lib/constants";

export const ledgerUpsertSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  current: z.number(),
  income: z.number(),
  parentSupport: z.number(),
  budget: z.number(),
  exchangeRate: z.preprocess(value => (value === '' ? undefined : value), z.number().optional()),
  currency: z.nativeEnum(CURRENCY).optional(),
  remarks: z.string().max(500).optional(),
});
