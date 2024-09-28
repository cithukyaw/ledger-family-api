import { z } from 'zod';
import {singleUserSchema, userLedgerQuerySchema} from "../validations/user.validation";

export type FilterLedgerParamDto = z.infer<typeof singleUserSchema>
export type FilterLedgerQueryDto = z.infer<typeof userLedgerQuerySchema>
