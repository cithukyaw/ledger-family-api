import {Request, Response} from "express";
import {CreateBudgetResponse} from "../types/declarations";
import {apiValidationError} from "../lib/api";
import {Budget} from "@prisma/client";
import {budgetUpsertSchema} from "../validations/budget.validation";
import {upsertBudget} from "../services/budget.service";
import {UpsertBudgetDto} from "../dtos/UpsertBudgetDto";

class BudgetController {
  /**
   * Create/Update a budget record
   */
  public static async upsert(req: Request<{}, {}, UpsertBudgetDto>, res: Response<CreateBudgetResponse>) {
    const validation = budgetUpsertSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    if (req.body.userId !== req.user) {
      return apiValidationError(res, 'userId', 'Unauthorized user id.');
    }

    const data = req.body;
    data.userId = req.user as number;

    const budget: Budget = await upsertBudget(data);

    return res.status(201).send(budget);
  }
}

export default BudgetController;
