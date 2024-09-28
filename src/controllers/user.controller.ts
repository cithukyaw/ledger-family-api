import {Request, Response} from 'express';
import {findUsers, getUserById} from "../services/user.service";
import {singleUserSchema, userLedgerQuerySchema} from "../validations/user.validation";
import {SingleLedgerResponse, SingleUserResponse, UsersResponse} from "../types/declarations";
import {ParamIdToNumber} from "../lib/decorators";
import {apiValidationError} from "../lib/api";
import {findLedger} from "../services/ledger.service";
import dayjs from "dayjs";
import {FilterLedgerParamDto, FilterLedgerQueryDto} from "../dtos/FilterLedgerDto";

class UserController {
  /**
   * Return all users
   */
  public static async getUsers(req: Request, res: Response<UsersResponse>) {
    const users = await findUsers();

    return res.status(200).json(users);
  }

  /**
   * Return a user by id
   */
  @ParamIdToNumber()
  public static async getUser(req: Request, res: Response<SingleUserResponse>) {
    const validation = singleUserSchema.safeParse(req.params);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const id = req.params.id as unknown as number;

    if (req.user !== req.params.id) {
      return apiValidationError(res, 'id', 'Unauthorized user id.');
    }

    const user = await getUserById(id);
    if (!user) {
      return apiValidationError(res, 'id', 'User not found');
    }

    return res.status(200).json(user);
  }

  /**
   * Return ledger by user id
   */
  @ParamIdToNumber()
  public static async getLedger(req: Request<FilterLedgerParamDto, {}, {}, FilterLedgerQueryDto>, res: Response<SingleLedgerResponse>) {
    const id = req.params.id as unknown as number;
    if (req.user !== id) {
      return apiValidationError(res, 'id', 'Unauthorized user id.');
    }

    const validation = userLedgerQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    let date = dayjs().startOf('month').format('YYYY-MM-DD');
    if (validation.data.date) {
      date = dayjs(validation.data.date).startOf('month').format('YYYY-MM-DD');
    }

    const ledger = await findLedger(id, date);

    return res.status(200).json(ledger);
  }
}

export default UserController;
