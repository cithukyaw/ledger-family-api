import {Request, Response} from "express";
import {expenseCreateSchema} from "../validations/expense.validation";
import {apiValidationError} from "../lib/api";
import {CreateExpenseDto, CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {CreateExpenseResponse} from "../types/declarations";
import {createExpense} from "../services/expense.service";

class ExpenseController {
  /**
   * Create a new expense record
   */
  public static async createExpense(req: Request<{}, {}, CreateExpenseDto>, res: Response<CreateExpenseResponse>) {
    const validation = expenseCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const data = req.body as CreateExpenseDtoWithUserId;
    data.userId = req.user as number;

    const createdExpense = await createExpense(data);

    return res.status(201).send(createdExpense);
  }
}

export default ExpenseController;
