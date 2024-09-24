import { z } from 'zod';
import {ledgerCreateSchema} from "../validations/ledger.validation";

// Infer the base type from the schema
export type CreateLedgerDto = z.infer<typeof ledgerCreateSchema>
