import { z } from 'zod';
import {ledgerUpsertSchema} from "../validations/ledger.validation";

// Infer the base type from the schema
export type UpsertLedgerDto = z.infer<typeof ledgerUpsertSchema>
