import {PrismaClient} from "@prisma/client"
import {CreateUserDto} from "../dtos/CreateUser.dto";
import {ROLE} from "../lib/constants";
import {genSaltSync, hashSync} from "bcryptjs";

const prisma = new PrismaClient()

const publicUserFields = {
  id: true,
  username: true,
  email: true,
  role: true,
  active: true
};

export const findUsers = () => {
  return prisma.user.findMany({
    select: publicUserFields,
    orderBy: [{
      createdAt: 'desc'
    }]
  });
}

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    select: publicUserFields,
    where: { id }
  });
}

export const getUserByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: { username }
  });
}

export const createUser = async (user: CreateUserDto) => {
  const salt = genSaltSync(10)
  user.password = hashSync(user.password, salt);

  return prisma.user.create({
    data: {
      ...user,
      role: ROLE.MEMBER,
      active: true
    }
  });
}
