import { z } from 'zod';
import {passiveIncomeCreateSchema} from "../validations/passiveIncome.validation";

// Infer the base type from the schema
export type CreatePassiveIncomeDto = z.infer<typeof passiveIncomeCreateSchema>

// Extend the inferred type with the additional field
export type CreatePassiveIncomeDtoWithUserId = CreatePassiveIncomeDto & { userId: number };