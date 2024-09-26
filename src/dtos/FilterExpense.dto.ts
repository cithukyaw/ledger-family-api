import { z } from 'zod';
import {expenseFilterSchema} from "../validations/expense.validation";
import {PAY_TYPE_GROUP} from "../lib/constants";

export type FilterExpenseDto = z.infer<typeof expenseFilterSchema>

export type FilterPaymentTypeDto = FilterExpenseDto & { type: PAY_TYPE_GROUP }

export type FilterMonthlyExpensesDto = {
  userId: number,
  from: string,
  to: string,
}
