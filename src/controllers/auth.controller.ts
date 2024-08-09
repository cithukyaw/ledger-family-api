import {Request, Response} from 'express';
import {generateTokens} from "../lib/jwt";
import bcrypt from "bcryptjs";
import {createUser, getUserByEmail} from "../services/user.service";
import {CreateUserDto} from "../dtos/CreateUser.dto";
import {refreshTokenSchema, userCreateSchema, userLoginSchema} from "../validations/user.validation";
import {CreateUserResponse, LoginUserResponse, RefreshTokenResponse} from "../types/declarations";
import { Prisma } from '@prisma/client';
import {apiValidationError} from "../lib/api";
import {findUserByRefreshToken, saveAuthToken} from "../services/authToken.service";

class AuthController {
  /**
   * Register a new user
   */
  public static async register(req: Request<{}, {}, CreateUserDto>, res: Response<CreateUserResponse>) {
    const validation = userCreateSchema.safeParse(req.body);

    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    try {
      const createdUser = await createUser(req.body);
      return res.status(201).send(createdUser);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          return apiValidationError(res, 'email', 'This email address is already in use. Try another one.')
        }
      }
    }
  }

  /**
   * Authenticate a user by email and password
   */
  public static async login(req: Request, res: Response<LoginUserResponse>) {
    const validation = userLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const {email, password} = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return apiValidationError(res, 'email', 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiValidationError(res, 'password', 'Invalid credentials');
    }

    const tokens = generateTokens(user);

    await saveAuthToken(user.id, tokens);

    res.json(tokens);
  }

  /**
   * Refresh JWT token
   */
  public static async refreshToken(req: Request, res: Response<RefreshTokenResponse>) {
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    try {
      const { token } = req.body;
      const user = await findUserByRefreshToken(token);

      const tokens = generateTokens(user);
      await saveAuthToken(user.id, tokens);

      return res.json(tokens);
    } catch (err) {
      console.error(err);
      return apiValidationError(res, 'token', 'Invalid refresh token');
    }
  }

  /**
   * Invalidate user session or token
   */
  public static async logout(req: Request, res: Response) {
    // TODO: implement logout logic
    res.status(200).json({});
  }
}

export default AuthController;
