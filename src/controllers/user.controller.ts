import {Request, Response} from 'express';
import {findUsers, getUserById} from "../services/user.service";

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
export const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid ID provided. Expected an integer.' });
  }

  const user = await getUserById(id);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  return res.send(user);
}
