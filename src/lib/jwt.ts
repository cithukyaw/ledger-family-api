import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";
import {UserTokens} from "../types/declarations";

export const generateTokens = (user: User): UserTokens => {
  const payload = {
    id: user.id
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d'});

  return { accessToken, refreshToken };
}
