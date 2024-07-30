import {Request, Response} from 'express';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { User } from '../types/response';

export const getUsers = (req: Request, res: Response) => {
  return res.send([]);
}

export const getUser = (req: Request<{id: number}>, res: Response) => {
  const userId = req.params.id;
  console.log(userId);

  return res.send({
    id: userId
  });
}

export const createUser = (req: Request<{}, {}, CreateUserDto>, res: Response<User>) => {
  // TODO: create user
  console.log(req.body)

  const createdUser: User = {
    id: 1,
    username: "john.doe",
    email: "john.doe@example.com"
  };

  return res.status(201).send(createdUser);
}
