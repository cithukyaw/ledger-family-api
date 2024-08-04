import { z } from 'zod';
import {userCreateSchema} from "../lib/validation";

export type CreateUserDto = z.infer<typeof userCreateSchema>;
