import {Expense, User as UserModel} from "@prisma/client";

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

type UserFields = {
  [K in keyof User]: true;
}

export type Category = {
  id: number;
  name: string;
}

type CategoryFields = {
  [K in keyof Category]: true;
}

export type UserWithTokens = UserTokens & {
  user: User;
};

export type UserIdType = {
  id: number
}

type UsersResponse = User[];
export type CreateUserResponse = User | ApiError[];
export type PreCheckLoginResponse = UserIdType | ApiError[];
export type LoginUserResponse = UserWithTokens | ApiError[];
export type RefreshTokenResponse = UserTokens | ApiError[];
export type SingleUserResponse = User | ApiError[];

export type CreateExpenseResponse = Expense | ApiError[];

export type CategoriesResponse = Category[];
