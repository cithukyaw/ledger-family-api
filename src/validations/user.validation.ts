import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().max(255).email(),
});

export const userCreateSchema = z.object({
  name: z.string().max(255).optional(),
  email: z.string().max(100).email(),
  password: z.string().min(6).max(20),
});

export const userUpdateSchema = z.object({
  name: z.string().max(255),
  email: z.string().max(100).email(),
  password: z.string().min(6).max(20).optional(),
});

export const userLoginSchema = z.object({
  email: z.string().max(100).email(),
  password: z.string().min(6).max(20),
});

export const refreshTokenSchema = z.object({
  token: z.string().max(255),
})

export const singleUserSchema = z.object({
  id: z.number()
});

export const userLedgerQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional(),
})
