import { z } from 'zod';
import {userCreateSchema} from "../validations/user.validation";

export type CreateUserDto = z.infer<typeof userCreateSchema>;
