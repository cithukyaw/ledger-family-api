import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";
import {UserTokens} from "../types/declarations";

export const generateTokens = (user: User): UserTokens => {
  const payload = {
    id: user.id
  };

  const accessToken   = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES});
  const refreshToken  = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_REFRESH});

  return { accessToken, refreshToken };
}
