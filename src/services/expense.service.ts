import {Expense, Prisma, PrismaClient} from "@prisma/client";
import {CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {PAY_TYPE, PAY_TYPE_GROUP} from "../lib/constants";
import {FilterExpenseDto, FilterMonthlyExpensesDto, FilterPaymentTypeDto} from "../dtos/FilterExpense.dto";

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

export const updateExpense = async (id: number, expense: CreateExpenseDtoWithUserId): Promise<Expense> => {
  return prisma.expense.update({
    where: { id },
    data: {
      userId: expense.userId,
      categoryId: expense.category || null,
      type: expense.type || PAY_TYPE.CASH,
      date: new Date(expense.date),
      title: expense.title,
      amount: expense.amount,
      remarks: expense.remarks || null,
    }
  })
};

export const findExpenses = async (filter: FilterExpenseDto): Promise<Expense[]> => {
  let condition: Prisma.ExpenseWhereInput = {
    userId: filter.userId,
    date: {
      gte: new Date(filter.from),
      lte: new Date(filter.to),
    }
  };

  if (filter.category && filter.category.length > 0) {
    condition.categoryId = { in: filter.category };
  }

  return prisma.expense.findMany({
    where: condition,
    include: {
      category: true
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'asc' },
    ]
  })
};

export const getExpenseById = async (id: number, userId: number) => {
  return prisma.expense.findUnique({
    where: {
      id,
      userId
    }
  });
}

export const findTotalByPaymentType = async (filter: FilterPaymentTypeDto): Promise<number | null> => {
  let types: string[];

  if (filter.type === PAY_TYPE_GROUP.CASH) {
    types = [PAY_TYPE.CASH];
  } else {
    types = [
      PAY_TYPE.AYA_PAY,
      PAY_TYPE.AYA_BANK,
      PAY_TYPE.CB_PAY,
      PAY_TYPE.CB_BANK,
      PAY_TYPE.KPAY,
      PAY_TYPE.KBZ_BANK,
      PAY_TYPE.WAVE,
    ];
  }

  let condition: Prisma.ExpenseWhereInput = {
    userId: filter.userId,
    date: {
      gte: new Date(filter.from),
      lte: new Date(filter.to),
    },
    type: {
      in: types
    }
  };

  if (filter.category && filter.category.length > 0) {
    condition.categoryId = { in: filter.category };
  }

  const aggregations = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: condition
  });

  return aggregations._sum.amount;
}

export const deleteExpense = async (id: number): Promise<Expense> => {
  return prisma.expense.delete({
    where: { id }
  })
}

export const findMonthlyExpenses = async ({ userId, from, to }: FilterMonthlyExpensesDto): Promise<{ totalCash: number; totalBank: number }> => {
  const totalCash = await findTotalByPaymentType({
    userId, from, to,
    type: PAY_TYPE_GROUP.CASH
  }) || 0;

  const totalBank = await findTotalByPaymentType({
    userId, from, to,
    type: PAY_TYPE_GROUP.BANK
  }) || 0;

  return {totalCash, totalBank};
}
