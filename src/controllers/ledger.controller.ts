import {Request, Response} from "express";
import {CreateLedgerResponse} from "../types/declarations.js";
import {apiValidationError} from "../lib/api.js";
import {Ledger} from "../generated/prisma/client.js";
import {syncLedger, upsertLedger} from "../services/ledger.service.js";
import {UpsertLedgerDto} from "../dtos/UpsertLedgerDto.js";
import {ledgerUpsertSchema} from "../validations/ledger.validation.js";

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

    if (createdLedger) {
      await syncLedger(data.userId, data.date);
    }

    return res.status(201).send(createdLedger);
  }
}

export default LedgerController;
