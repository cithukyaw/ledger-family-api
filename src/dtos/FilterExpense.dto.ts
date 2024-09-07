import { z } from 'zod';
import {expenseFilterSchema} from "../validations/expense.validation";

export type FilterExpenseDto = z.infer<typeof expenseFilterSchema>
