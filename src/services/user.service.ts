import {PrismaClient, User as UserModel} from "@prisma/client"
import {CreateUserDto} from "../dtos/CreateUser.dto";
import {ROLE} from "../lib/constants";
import {genSaltSync, hashSync} from "bcryptjs";
import {User, UserFields} from "../types/declarations";

const prisma = new PrismaClient()

const publicUserFields: UserFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true
};

export const exposeUser = (data: UserModel): User => {
  const fields: string[] = Object.keys(publicUserFields);
  return Object.fromEntries(Object.entries(data).filter(([k]) => fields.includes(k))) as User;
}

export const findUsers = () => {
  return prisma.user.findMany({
    select: publicUserFields,
    orderBy: {
      name: 'asc'
    }
  });
}

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    select: publicUserFields,
    where: { id }
  });
}

export const getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email }
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
