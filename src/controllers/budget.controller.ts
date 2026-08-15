import {Request, Response} from "express";
import {CreateBudgetResponse} from "../types/declarations.js";
import {apiValidationError} from "../lib/api.js";
import {Budget} from "../generated/prisma/client.js";
import {budgetUpsertSchema} from "../validations/budget.validation.js";
import {upsertBudget} from "../services/budget.service.js";
import {UpsertBudgetDto} from "../dtos/UpsertBudgetDto.js";

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
