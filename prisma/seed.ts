import { PrismaClient } from "@prisma/client";
import {genSaltSync, hashSync} from "bcryptjs";
import {ROLE} from "../src/lib/constants";

const prisma = new PrismaClient();

const users = async () => {
  const salt = genSaltSync(10)

  await prisma.user.upsert({
    where: { email: 'admin@localhost.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@localhost.com',
      password: hashSync('password', salt),
      role: ROLE.ADMIN,
      active: true
    }
  });
}

const categories = async () => {
  const list = [
    'General',
    'Shopping',
    'Purchase',
    'Bill',
    'Pharmacy',
    'Travel',
    'Health',
    'Mobile Top-up',
    'Charity',
    'Family Eat-out'
  ];

  list.map(async (catName) => {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName
      }
    });
  })
}

const seed = async () => {
  await users();
  await categories();
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
