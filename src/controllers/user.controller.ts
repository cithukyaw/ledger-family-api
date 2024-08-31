import {Request, Response} from 'express';
import {findUsers, getUserById} from "../services/user.service";
import {singleUserSchema} from "../validations/user.validation";
import {SingleUserResponse, UsersResponse} from "../types/declarations";
import {ParamIdToNumber} from "../lib/decorators";
import {apiValidationError} from "../lib/api";

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

    const user = await getUserById(id);
    if (!user) {
      return apiValidationError(res, 'id', 'User not found');
    }

    return res.status(200).json(user);
  }
}

export default UserController;
