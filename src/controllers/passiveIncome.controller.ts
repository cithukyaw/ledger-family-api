import {Request, Response} from "express";
import {passiveIncomeCreateSchema, passiveIncomeFilterSchema, singlePassiveIncomeSchema} from "../validations/passiveIncome.validation";
import {apiValidationError} from "../lib/api";
import {CreatePassiveIncomeDto, CreatePassiveIncomeDtoWithUserId} from "../dtos/CreatePassiveIncome.dto";
import {
  CreatePassiveIncomeResponse,
  DeletePassiveIncomeResponse,
  PassiveIncomesResponse,
  SinglePassiveIncomeResponse,
} from "../types/declarations";
import {
  createPassiveIncome,
  deletePassiveIncome,
  findPassiveIncomes,
  findTotalPassiveIncome,
  getPassiveIncomeById,
  updatePassiveIncome
} from "../services/passiveIncome.service";
import {FilterPassiveIncomeDto} from "../dtos/FilterPassiveIncome.dto";
import {ParamIdToNumber, QueryStrToNumber} from "../lib/decorators";
import {PassiveIncome} from "@prisma/client";
import {updateLedger} from "../services/ledger.service";
import dayjs from "dayjs";

class PassiveIncomeController {
  /**
   * Get a list of passive incomes by range
   */
  @QueryStrToNumber('userId')
  public static async getPassiveIncomes(req: Request<{}, {}, {}, FilterPassiveIncomeDto>, res: Response<PassiveIncomesResponse>) {
    const validation = passiveIncomeFilterSchema.safeParse(req.query);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    if (req.user !== validation.data.userId) {
      return apiValidationError(res, 'userId', 'Unauthorized user id.');
    }

    const data = await findPassiveIncomes(validation.data);
    const total = await findTotalPassiveIncome(validation.data) || 0;

    return res.status(200).json({
      data,
      meta: {
        count: data.length,
        total,
      }
    });
  }

  /**
   * Create a new passive income record
   */
  public static async createPassiveIncome(req: Request<{}, {}, CreatePassiveIncomeDto>, res: Response<CreatePassiveIncomeResponse>) {
    const validation = passiveIncomeCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const data = req.body as CreatePassiveIncomeDtoWithUserId;
    data.userId = req.user as number;

    const createdPassiveIncome: PassiveIncome = await createPassiveIncome(data);
    if (createdPassiveIncome) {
      await updateLedger(data.userId, data.date);
    }

    return res.status(201).send(createdPassiveIncome);
  }

  /**
   * Update the passive income record
   */
  @ParamIdToNumber()
  public static async updatePassiveIncome(req: Request<{id: number}, {}, CreatePassiveIncomeDto>, res: Response<CreatePassiveIncomeResponse>) {
    const validation = passiveIncomeCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;
    const data = req.body as CreatePassiveIncomeDtoWithUserId;
    data.userId = req.user as number;

    const updatedPassiveIncome: PassiveIncome = await updatePassiveIncome(id, data);
    if (updatedPassiveIncome) {
      await updateLedger(data.userId, data.date);
    }

    return res.status(201).send(updatedPassiveIncome);
  }

  /**
   * Delete passive income by id
   */
  @ParamIdToNumber()
  public static async deletePassiveIncome(req: Request, res: Response<DeletePassiveIncomeResponse>) {
    const validation = singlePassiveIncomeSchema.safeParse(req.params);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;

    try {
      const deleted = await deletePassiveIncome(id);

      await updateLedger(deleted.userId, dayjs(deleted.date).format('YYYY-MM-DD'));

      return res.status(200).json(deleted);
    } catch (err) {
      if (err instanceof Error && (err as any).code === 'P2025') {
        return apiValidationError(res, 'id', 'Passive income record not found.');
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
   * Return a passive income by id
   */
  @ParamIdToNumber()
  public static async getPassiveIncome(req: Request, res: Response<SinglePassiveIncomeResponse>) {
    const validation = singlePassiveIncomeSchema.safeParse(req.params);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;

    const passiveIncome = await getPassiveIncomeById(id, req.user as number);
    if (!passiveIncome) {
      return apiValidationError(res, 'id', 'Passive income not found');
    }

    return res.status(200).json(passiveIncome);
  }
}

export default PassiveIncomeController;