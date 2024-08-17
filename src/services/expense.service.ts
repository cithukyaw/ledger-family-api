import { PrismaClient } from "@prisma/client";
import {CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {PAY_TYPE} from "../lib/constants";

const prisma = new PrismaClient();

export const createExpense = async (expense: CreateExpenseDtoWithUserId) => {
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
