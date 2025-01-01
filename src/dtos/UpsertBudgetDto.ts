import { z } from 'zod';
import {budgetUpsertSchema} from "../validations/budget.validation";

// Infer the base type from the schema
export type UpsertBudgetDto = z.infer<typeof budgetUpsertSchema>
