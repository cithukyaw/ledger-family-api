import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().max(255).optional(),
  email: z.string().max(100).email(),
  password: z.string().min(8).max(20),
});

export const userLoginSchema = z.object({
  email: z.string().max(100).email(),
  password: z.string().min(8).max(20),
});

export const singleUserSchema = z.object({
  id: z.number()
});
