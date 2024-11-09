import {Request, Response} from "express";
import {expenseCreateSchema, expenseFilterSchema, singleExpenseSchema} from "../validations/expense.validation";
import {apiValidationError} from "../lib/api";
import {CreateExpenseDto, CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {
  CreateExpenseResponse,
  DeleteExpenseResponse,
  ExpensesResponse,
  PaymentTypesResponse,
  SingleExpenseResponse,
} from "../types/declarations";
import {
  createExpense,
  deleteExpense,
  findExpenses,
  findTotalByPaymentType,
  getExpenseById, updateExpense
} from "../services/expense.service";
import {PAY_TYPE, PAY_TYPE_GROUP} from "../lib/constants";
import {FilterExpenseDto} from "../dtos/FilterExpense.dto";
import {ParamIdToNumber, QueryStrToNumArray, QueryStrToNumber} from "../lib/decorators";
import {Expense} from "@prisma/client";
import {updateLedger} from "../services/ledger.service";
import dayjs from "dayjs";

class ExpenseController {
  /**
   * Get a list of expenses by range
   */
  @QueryStrToNumber('userId')
  @QueryStrToNumArray('category')
  public static async getExpenses(req: Request<{}, {}, {}, FilterExpenseDto>, res: Response<ExpensesResponse>) {
    const validation = expenseFilterSchema.safeParse(req.query);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    if (req.user !== validation.data.userId) {
      return apiValidationError(res, 'userId', 'Unauthorized user id.');
    }

    const data = await findExpenses(validation.data);
    let totalCash: number | null = 0;
    let totalBank: number | null = 0;

    if (validation.data.paymentType && validation.data.paymentType === PAY_TYPE_GROUP.CASH) {
      totalCash = await findTotalByPaymentType({
        ...validation.data,
        type: PAY_TYPE_GROUP.CASH,
      });
    }

    if (validation.data.paymentType && validation.data.paymentType === PAY_TYPE_GROUP.BANK) {
      totalBank = await findTotalByPaymentType({
        ...validation.data,
        type: PAY_TYPE_GROUP.BANK,
      });
    }

    const initialValue = 0;
    const total = data.reduce((accumulator, row) => accumulator + row.amount, initialValue);

    return res.status(200).json({
      data,
      meta: {
        count: data.length,
        total,
        totalCash: totalCash ? totalCash : 0,
        totalBank: totalBank ? totalBank : 0,
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
    if (createdExpense) {
      await updateLedger(data.userId, data.date);
    }

    return res.status(201).send(createdExpense);
  }

  /**
   * Update the expense record
   */
  @ParamIdToNumber()
  public static async updateExpense(req: Request<{id: number}, {}, CreateExpenseDto>, res: Response<CreateExpenseResponse>) {
    const validation = expenseCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;
    const data = req.body as CreateExpenseDtoWithUserId;
    data.userId = req.user as number;

    const updatedExpense: Expense = await updateExpense(id, data);
    if (updatedExpense) {
      await updateLedger(data.userId, data.date);
    }

    return res.status(201).send(updatedExpense);
  }

  /**
   * Delete expense by id
   */
  @ParamIdToNumber()
  public static async deleteExpense(req: Request, res: Response<DeleteExpenseResponse>) {
    const validation = singleExpenseSchema.safeParse(req.params);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;

    try {
      const deleted = await deleteExpense(id);

      await updateLedger(deleted.userId, dayjs(deleted.date).format('YYYY-MM-DD'));

      return res.status(200).json(deleted);
    } catch (err) {
      if (err instanceof Error && (err as any).code === 'P2025') {
        return apiValidationError(res, 'id', 'Expense record not found.');
      }
    }

    return res.status(500).json([
      {
        field: 'id',
        message: 'Something went wrong'
      }
    ]);
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

  /**
   * Return an expense by id
   */
  @ParamIdToNumber()
  public static async getExpense(req: Request, res: Response<SingleExpenseResponse>) {
    const validation = singleExpenseSchema.safeParse(req.params);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;

    const expense = await getExpenseById(id, req.user as number);
    if (!expense) {
      return apiValidationError(res, 'id', 'Expense not found');
    }

    return res.status(200).json(expense);
  }
}

export default ExpenseController;
