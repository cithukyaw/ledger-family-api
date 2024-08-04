import {User} from "@prisma/client";
import {ZodError} from "zod";

export interface ApiError {
  field: string;
  message: string;
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export type CreateUserResponse = User | ZodError | ApiError[];

export type LoginUserResponse = UserTokens | ZodError | ApiError[];
