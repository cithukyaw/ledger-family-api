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

export type CreateUserResponse = UserModel | ApiError[];

export type LoginUserResponse = UserTokens | ApiError[];

export type RefreshTokenResponse = UserTokens | ApiError[];

export type SingleUserResponse = User | ApiError[];
