import {Expense, User as UserModel} from "@prisma/client";

interface ApiError {
  field: string;
  message: string;
}

interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

type User = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
}

type UserFields = {
  [K in keyof User]: true;
}

type Category = {
  id: number;
  name: string;
}

type CategoryFields = {
  [K in keyof Category]: true;
}

type UserWithTokens = UserTokens & {
  user: User;
};

type UserIdType = {
  id: number
}

type UsersResponse = User[];
type CreateUserResponse = User | ApiError[];
type PreCheckLoginResponse = UserIdType | ApiError[];
type LoginUserResponse = UserWithTokens | ApiError[];
type RefreshTokenResponse = UserTokens | ApiError[];
type SingleUserResponse = User | ApiError[];

type CreateExpenseResponse = Expense | ApiError[];

type CategoriesResponse = Category[];
