import {Request, Response} from 'express';
import {generateTokens} from "../lib/jwt";
import bcrypt from "bcryptjs";
import {createUser, getUserByEmail} from "../services/user.service";
import {CreateUserDto} from "../dtos/CreateUser.dto";
import {User} from "@prisma/client";

/**
 * Controller: register
 * Register a new user
 */
export const register = async (req: Request<{}, {}, CreateUserDto>, res: Response<User>) => {
  const createdUser = await createUser(req.body);

  return res.status(201).send(createdUser);
}

/**
 * Controller: login
 * Authenticate a user by email and password
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const tokens = generateTokens(user);

  res.json(tokens);
}

/**
 * Controller: logout
 * Invalidate user session or token
 */
export const logout = async (req: Request, res: Response) => {
  // TODO: implement logout logic
  res.status(200).json({});
}
