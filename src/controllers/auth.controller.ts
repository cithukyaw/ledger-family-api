import {Request, Response} from 'express';
import {deleteTokenCookie, generateTokens, saveTokenInCookie} from "../lib/jwt";
import bcrypt from "bcryptjs";
import {createUser, getUserByEmail, exposeUser} from "../services/user.service";
import {CreateUserDto, SingleUserDto} from "../dtos/User.dto";
import {
  emailSchema,
  refreshTokenSchema,
  singleUserSchema,
  userCreateSchema,
  userLoginSchema
} from "../validations/user.validation";
import {
  CreateUserResponse,
  LoginUserResponse, PreCheckLoginResponse,
  RefreshTokenResponse, SingleUserResponse
} from "../types/declarations";
import { Prisma } from '@prisma/client';
import {apiValidationError} from "../lib/api";
import {findUserByRefreshToken, saveAuthToken} from "../services/authToken.service";

class AuthController {
  /**
   * Check registering email is available or not
   * Return 400 if the email address is not available
   * Return 204 if the email address is available
   */
  public static async checkAvailability(req: Request, res: Response) {
    const validation = emailSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const user = await getUserByEmail(req.body.email);
    if (user) {
      return apiValidationError(res, 'email', 'This email address is already in use. Try another one.');
    }

    return res.status(204).send();
  }

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
      return res.status(201).send(exposeUser(createdUser));
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
   * Pre-check login if the login email address is valid
   */
  public static async preCheckLogin(req: Request, res: Response<PreCheckLoginResponse>) {
    const validation = emailSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return apiValidationError(res, 'email', 'No registered user with this email address.');
    }

    if (!user.active) {
      return apiValidationError(res, 'email', 'User is not active.');
    }

    return res.status(200).json({
      id: user.id
    });
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
      return apiValidationError(res, 'email', 'User not found with this email address.');
    }

    if (!user.active) {
      return apiValidationError(res, 'email', 'User is not active.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiValidationError(res, 'password', 'Invalid password.');
    }

    const tokens = generateTokens(user);

    if (process.env.JWT_COOKIE_NAME) {
      saveTokenInCookie(process.env.JWT_COOKIE_NAME, tokens.accessToken, res);
    }

    await saveAuthToken(user.id, tokens);

    return res.json({
      user: exposeUser(user),
      ...tokens
    });
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
  public static async logout(req: Request<{}, {}, {}, SingleUserDto>, res: Response<SingleUserResponse>) {
    const validation = singleUserSchema.safeParse(req.body);
    if (!validation.success) {
      return apiValidationError(res, validation.error);
    }

    const { id } = req.body as SingleUserDto
    if (req.user !== id) {
      return apiValidationError(res, 'id', 'Unauthorized user id.');
    }

    if (process.env.JWT_COOKIE_NAME) {
      deleteTokenCookie(process.env.JWT_COOKIE_NAME, res);
    }

    return res.status(204).json([]);
  }
}

export default AuthController;
