import {Request, Response} from 'express';
import {findUsers, getUserById} from "../services/user.service";
import {singleUserSchema} from "../lib/validation";
import {SingleUserResponse} from "../types/declarations";

/**
 * Controller: getUsers
 * Return all users
 */
export const getUsers = async (req: Request, res: Response) => {
  const users = await findUsers();

  return res.send(users);
}

/**
 * Controller: getUser
 * Return a user by id
 */
export const getUser = async (req: Request, res: Response<SingleUserResponse>) => {
  const validation = singleUserSchema.safeParse(req.params);
  if (!validation.success) {
    res.status(400).json(validation.error);
  }

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send([
      {
        field: 'id',
        message: 'Invalid ID provided. Expected an integer.'
      }
    ]);
  }

  const user = await getUserById(id);
  if (!user) {
    return res.status(400).json([
      {
        field: 'id',
        message: 'User not found'
      }
    ]);
  }

  return res.send(user);
}
