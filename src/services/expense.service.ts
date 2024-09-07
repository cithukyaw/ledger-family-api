import {Expense, PrismaClient} from "@prisma/client";
import {CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {PAY_TYPE} from "../lib/constants";
import {FilterExpenseDto} from "../dtos/FilterExpense.dto";

const prisma = new PrismaClient();

export const createExpense = async (expense: CreateExpenseDtoWithUserId): Promise<Expense> => {
  return prisma.expense.create({
    data: {
      userId: expense.userId,
      categoryId: expense.category || null,
      type: expense.type || PAY_TYPE.CASH,
      date: new Date(expense.date),
      title: expense.title,
      amount: expense.amount,
      remarks: expense.remarks || null,
    }
  });
};

export const findExpenses = async (filter: FilterExpenseDto): Promise<Expense[]> => {
  return prisma.expense.findMany({
    where: {
      userId: filter.userId,
      date: {
        gte: new Date(filter.from),
        lte: new Date(filter.to),
      }
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'asc' },
    ]
  })
};
