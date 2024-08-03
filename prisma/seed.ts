import { PrismaClient } from "@prisma/client";
import {genSaltSync, hashSync} from "bcryptjs";
import {ROLE} from "../src/lib/constants";

const prisma = new PrismaClient();

async function seed() {
  const salt = genSaltSync(10)

  await prisma.user.create({
    data: {
      name: 'Administrator',
      email: 'admin@localhost.com',
      password: hashSync('password', salt),
      role: ROLE.ADMIN,
      active: true
    }
  })
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
