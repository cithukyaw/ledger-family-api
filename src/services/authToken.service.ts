import {PrismaClient, User} from "@prisma/client";
import {UserTokens} from "../types/declarations";

const prisma = new PrismaClient();

export const saveAuthToken = async (userId: number, tokens: UserTokens) => {
  await prisma.authToken.deleteMany({
    where: {
      userId: userId
    },
  })

  return prisma.authToken.create({
    data: {
      userId,
      ...tokens
    }
  })
}

export const findUserByRefreshToken = async (token: string): Promise<User> => {
  const authToken = await prisma.authToken.findFirstOrThrow({
    where: {
      refreshToken: token
    },
    include: {
      user: true
    }
  });

  return authToken.user;
}
