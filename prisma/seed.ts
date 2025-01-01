import { Budget, Ledger, PrismaClient } from "@prisma/client";
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
    'Transportation',
    'Health',
    'Mobile Top-up',
    'Charity',
    'Eat Out',
    'Food & Snacks',
    'Pocket Money',
    'Wet Market',
    'Drinking Water'
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

const budgets = async () => {
  const ledgers: Ledger[] = await prisma.ledger.findMany();
  for (let row of ledgers) {
    const budget: Budget | null = await prisma.budget.findFirst({
      where: {
        ledgerId: row.id
      }
    });

    if (budget) {
      continue;
    }

    await prisma.budget.create({
      data: {
        userId: row.userId,
        ledgerId: row.id,
        date: row.date,
        amount: row.budget
      }
    })
  }
}

const seed = async () => {
  await users();
  await categories();
  await budgets();
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
