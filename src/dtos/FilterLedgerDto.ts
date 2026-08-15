import { z } from 'zod';
import {singleUserSchema, userLedgerQuerySchema} from "../validations/user.validation.js";

export type FilterLedgerParamDto = z.infer<typeof singleUserSchema>
export type FilterLedgerQueryDto = z.infer<typeof userLedgerQuerySchema>
