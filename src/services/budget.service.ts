import {Budget, PrismaClient} from "@prisma/client";
import {UpsertBudgetDto} from "../dtos/UpsertBudgetDto";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const findBudget = async (ledgerId: number, date: string): Promise<Budget | null> => {
  return prisma.budget.findFirst({
    where: {
      ledgerId,
      date,
    }
  });
}

export const upsertBudget = async (data: UpsertBudgetDto) => {
  const dt = dayjs(data.date).format('YYYY-MM-DD');

  let budget;
  if (data.id) {
    // find budget by id
    budget = await prisma.budget.findUnique({
      where: { id: data.id }
    })
  } else {
    // find budget by ledgerId and date
    budget = await findBudget(data.ledgerId, dt);
  }

  const upsertData = {
    userId: data.userId,
    ledgerId: data.ledgerId,
    date: dt,
    amount: data.amount,
  };

  if (budget) {
    return prisma.budget.update({
      where: {
        id: budget.id
      },
      data: upsertData
    });
  } else {
    return prisma.budget.create({
      data: upsertData
    });
  }
}
