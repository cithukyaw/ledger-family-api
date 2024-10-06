import {Request, Response} from 'express';
import {exposeUser, findUsers, getUserByEmail, getUserById, updateUser} from "../services/user.service";
import {singleUserSchema, userLedgerQuerySchema, userUpdateSchema} from "../validations/user.validation";
import {ApiError, SingleLedgerResponse, SingleUserResponse, UsersResponse} from "../types/declarations";
import {ParamIdToNumber} from "../lib/decorators";
import {apiValidationError} from "../lib/api";
import {findLedger} from "../services/ledger.service";
import dayjs from "dayjs";
import {FilterLedgerParamDto, FilterLedgerQueryDto} from "../dtos/FilterLedgerDto";
import {CreateUserDto, SingleUserDto, UpdateUserDto} from "../dtos/User.dto";
import {User} from "@prisma/client";

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
   * Update user by id
   */
  @ParamIdToNumber()
  public static async updateUser(req: Request<SingleUserDto, {}, {}, UpdateUserDto>, res: Response<SingleUserResponse>) {
    const validation = userUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const userId = req.params.id as unknown as number;
    if (req.user !== userId) {
      return apiValidationError(res, 'id', 'Unauthorized user id.');
    }

    const data = req.body as UpdateUserDto;

    // User's email validation
    const otherUser = await getUserByEmail(data.email, userId);
    if (otherUser) {
      return apiValidationError(res, 'email', 'This email address is already in use. Try another one.');
    }

    // User validation
    const user = await getUserById(userId);
    if (!user) {
      return apiValidationError(res, 'id', 'User not found');
    }

    const updatedUser = await updateUser(userId, data);

    return res.status(200).json(exposeUser(updatedUser));
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
