import { z } from 'zod';
import {expenseCreateSchema} from "../validations/expense.validation";

// Infer the base type from the schema
export type CreateExpenseDto = z.infer<typeof expenseCreateSchema>

// Extend the inferred type with the additional field
export type CreateExpenseDtoWithUserId = CreateExpenseDto & { userId: number } & { type: string };
