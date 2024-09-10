import {Expense, PrismaClient} from "@prisma/client";
import {CreateExpenseDtoWithUserId} from "../dtos/CreateExpense.dto";
import {PAY_TYPE, PAY_TYPE_GROUP} from "../lib/constants";
import {FilterExpenseDto, FilterPaymentTypeDto} from "../dtos/FilterExpense.dto";

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
    include: {
      category: true
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'asc' },
    ]
  })
};

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

  const aggregations = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId: filter.userId,
      date: {
        gte: new Date(filter.from),
        lte: new Date(filter.to),
      },
      type: {
        in: types
      }
    }
  });

  return aggregations._sum.amount;
}
