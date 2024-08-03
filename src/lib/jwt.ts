import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";

export const generateTokens = (user: User) => {
  const payload = {
    id: user.id
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d'});

  return { accessToken, refreshToken };
}
