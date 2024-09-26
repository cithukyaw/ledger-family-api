import {Request, Response} from "express";
import {CreateLedgerResponse} from "../types/declarations";
import {apiValidationError} from "../lib/api";
import {Ledger} from "@prisma/client";
import {upsertLedger} from "../services/ledger.service";
import {CreateLedgerDto} from "../dtos/CreateLedger.dto";
import {ledgerCreateSchema} from "../validations/ledger.validation";

class LedgerController {
  /**
   * Create a new ledger record
   */
  public static async upsert(req: Request<{}, {}, CreateLedgerDto>, res: Response<CreateLedgerResponse>) {
    const validation = ledgerCreateSchema.safeParse(req.body);
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
