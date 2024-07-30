import {Request, Response} from 'express';

export const getUsers = (req: Request, res: Response) => {
  return res.send([]);
}

export const getUser = (req: Request, res: Response) => {
  return res.send({});
}

export const createUser = (req: Request, res: Response) => {
  return res.send({});
}
