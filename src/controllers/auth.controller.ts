import {Request, Response} from 'express';
import {generateTokens} from "../lib/jwt";
import bcrypt from "bcryptjs";
import {createUser, getUserByEmail} from "../services/user.service";
import {CreateUserDto} from "../dtos/CreateUser.dto";
import {userCreateSchema, userLoginSchema} from "../lib/validation";
import {CreateUserResponse, LoginUserResponse} from "../types/user";
import { Prisma } from '@prisma/client';

/**
 * Controller: register
 * Register a new user
 */
export const register = async (req: Request<{}, {}, CreateUserDto>, res: Response<CreateUserResponse>) => {
  const validation = userCreateSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json(validation.error);
  }

  try {
    const createdUser = await createUser(req.body);
    return res.status(201).send(createdUser);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return res.status(400).json([
          {
            field: 'email',
            message: 'This email address is already in use. Try another one.'
          }
        ])
      }
    }
  }
}

/**
 * Controller: login
 * Authenticate a user by email and password
 */
export const login = async (req: Request, res: Response<LoginUserResponse>) => {
  const validation = userLoginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error);
  }

  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(400).json([
      {
        field: 'email',
        message: 'User not found'
      }
    ]);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json([
      {
        field: 'password',
        message: 'Invalid credentials'
      }
   ]);
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
