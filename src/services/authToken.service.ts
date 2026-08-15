import {User} from "../generated/prisma/client.js";
import {prisma} from "../lib/prisma.js";
import {UserTokens} from "../types/declarations.js";


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
      refreshToken: token,
      deletedAt: null
    },
    include: {
      user: true
    }
  });

  return authToken.user;
}
