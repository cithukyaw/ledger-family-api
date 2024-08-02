import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";

export const generateToken = (user: User) => {
  const payload = {
    id: user.id
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string);
}
