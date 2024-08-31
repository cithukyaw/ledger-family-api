import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";
import {UserTokens} from "../types/declarations";
import {Response} from 'express';

export const generateTokens = (user: User): UserTokens => {
  const payload = {
    id: user.id
  };

  const accessToken   = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES});
  const refreshToken  = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_REFRESH});

  return { accessToken, refreshToken };
}

// Set the token in an HTTP-only cookie
export const saveTokenInCookie = (name:string, token: string, res: Response) => {
  let expiry = 30;
  if (typeof process.env.JWT_COOKIE_MAX_AGE === 'string') {
    expiry = parseInt(process.env.JWT_COOKIE_MAX_AGE);
  }

  res.cookie(name, token, {
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    sameSite: 'lax', // Helps protect against CSRF
    maxAge: expiry * 60 * 1000 // in millisecond
  });
}
