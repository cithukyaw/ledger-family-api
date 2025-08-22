import {Request, Response} from "express";
import {CreateLedgerResponse} from "../types/declarations";
import {apiValidationError} from "../lib/api";
import {Ledger} from "@prisma/client";
import {upsertLedger} from "../services/ledger.service";
import {UpsertLedgerDto} from "../dtos/UpsertLedgerDto";
import {ledgerUpsertSchema} from "../validations/ledger.validation";

class LedgerController {
  /**
   * Create/Update a ledger record
   */
  public static async upsert(req: Request<{}, {}, UpsertLedgerDto>, res: Response<CreateLedgerResponse>) {
    const validation = ledgerUpsertSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    if (req.body.userId !== req.user) {
      return apiValidationError(res, 'userId', 'Unauthorized user id.');
    }

    const data = req.body;
    data.userId = req.user as number;

    const createdLedger: Ledger = await upsertLedger(data);

    return res.status(201).send(createdLedger);
  }
}

export default LedgerController;
