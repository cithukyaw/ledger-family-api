import { z } from 'zod';
import {singleUserSchema, userCreateSchema, userUpdateSchema} from "../validations/user.validation";

export type CreateUserDto = z.infer<typeof userCreateSchema>;

export type UpdateUserDto = z.infer<typeof userUpdateSchema>;

export type SingleUserDto = z.infer<typeof singleUserSchema>;
