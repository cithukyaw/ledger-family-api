import {Request, Response} from 'express';
import {findUsers, getUserById} from "../services/user.service";
import {singleUserSchema} from "../lib/validation";
import {SingleUserResponse} from "../types/declarations";
import {ParamIdToNumber} from "../lib/decorators";

class UserController {
  /**
   * Controller: getUsers
   * Return all users
   */
  public static async getUsers(req: Request, res: Response) {
    const users = await findUsers();

    return res.status(200).json(users);
  }

  /**
   * Controller: getUser
   * Return a user by id
   */
  @ParamIdToNumber()
  public static async getUser(req: Request, res: Response<SingleUserResponse>) {
    const validation = singleUserSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const id = req.params.id as unknown as number;

    const user = await getUserById(id);
    if (!user) {
      return res.status(400).json([
        {
          field: 'id',
          message: 'User not found'
        }
      ]);
    }

    return res.status(200).json(user);
  }
}

export default UserController;
