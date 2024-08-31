import {Request, Response} from "express";
import {expenseCreateSchema} from "../validations/expense.validation";
import {apiValidationError} from "../lib/api";
import {CreateExpenseDto, CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {CreateExpenseResponse, PaymentTypesResponse} from "../types/declarations";
import {createExpense} from "../services/expense.service";
import { PAY_TYPE } from "../lib/constants";

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

  /**
   * Return the list of payment types
   */
  public static getPaymentTypes(req: Request, res: Response<PaymentTypesResponse>) {
    const types = {
      [PAY_TYPE.CASH]: 'Cash',
      [PAY_TYPE.AYA_PAY]: 'AYA Pay',
      [PAY_TYPE.AYA_BANK]: 'AYA Banking',
      [PAY_TYPE.CB_PAY]: 'CB Pay',
      [PAY_TYPE.CB_BANK]: 'CB Banking',
      [PAY_TYPE.KPAY]: 'KBZ Pay',
      [PAY_TYPE.KBZ_BANK]: 'KBZ Banking',
      [PAY_TYPE.WAVE]: 'WavePay',
    }

    return res.status(200).json(types);
  }
}

export default ExpenseController;
