import {Request, Response} from "express";
import {expenseCreateSchema, expenseFilterSchema} from "../validations/expense.validation";
import {apiValidationError} from "../lib/api";
import {CreateExpenseDto, CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {CreateExpenseResponse, ExpensesResponse, PaymentTypesResponse} from "../types/declarations";
import {createExpense, findExpenses} from "../services/expense.service";
import { PAY_TYPE } from "../lib/constants";
import {FilterExpenseDto} from "../dtos/FilterExpense.dto";
import {QueryStrToNumber} from "../lib/decorators";
import {Expense} from "@prisma/client";

class ExpenseController {
  /**
   * Get a list of expenses by range
   */
  @QueryStrToNumber('userId')
  public static async getExpenses(req: Request<{}, {}, {}, FilterExpenseDto>, res: Response<ExpensesResponse>) {
    const validation = expenseFilterSchema.safeParse(req.query);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    if (req.user !== validation.data.userId) {
      return apiValidationError(res, 'userId', 'Unauthorized user id.');
    }

    const data = await findExpenses(validation.data);

    const initialValue = 0;
    const total = data.reduce((accumulator, row) => accumulator + row.amount, initialValue);

    return res.status(200).json({
      data,
      meta: {
        count: data.length,
        total,
      }
    });
  }

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

    const createdExpense: Expense = await createExpense(data);

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
