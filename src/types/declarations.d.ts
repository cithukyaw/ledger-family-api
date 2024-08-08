import {User as UserModel} from "@prisma/client";
import {ZodError} from "zod";

export interface ApiError {
  field: string;
  message: string;
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export type User = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
}

export type CreateUserResponse = UserModel | ZodError | ApiError[];

export type LoginUserResponse = UserTokens | ZodError | ApiError[];

export type RefreshTokenResponse = UserTokens | ZodError | ApiError[];

export type SingleUserResponse = User | ZodError | ApiError[];
