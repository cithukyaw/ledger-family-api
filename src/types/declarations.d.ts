import {Expense, Ledger} from "@prisma/client";
import {PAY_TYPE} from "../lib/constants";

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

type ListResponse = {
  data: T[],
  meta: JsonValue,
}

type UsersResponse = User[];
type CreateUserResponse = User | ApiError[];
type PreCheckLoginResponse = UserIdType | ApiError[];
type LoginUserResponse = UserWithTokens | ApiError[];
type RefreshTokenResponse = UserTokens | ApiError[];
type SingleUserResponse = User | ApiError[];

type CreateExpenseResponse = Expense | ApiError[];
type ExpensesResponse = ListResponse | ApiError[];
type DeleteExpenseResponse = Expense | ApiError[];

type CategoriesResponse = Category[];

type CreateLedgerResponse = Ledger | ApiError[];
type SingleLedgerResponse = Ledger | ApiError[] | null;

type PaymentTypesResponse = {
  [key in PAY_TYPE]: string
}
