import { PassiveIncome, Prisma, PrismaClient } from "@prisma/client";
import { CreatePassiveIncomeDtoWithUserId } from "../dtos/CreatePassiveIncome.dto";
import { FilterPassiveIncomeDto, FilterMonthlyPassiveIncomeDto } from "../dtos/FilterPassiveIncome.dto";

const prisma = new PrismaClient();

const getPassiveIncomeWhere = (filter: FilterPassiveIncomeDto): Prisma.PassiveIncomeWhereInput => {
  let condition: Prisma.PassiveIncomeWhereInput = {
    userId: filter.userId,
    date: {
      gte: filter.from,
      lte: filter.to,
    },
  };

  if (filter.keyword) {
    condition.OR = [
      {
        title: { contains: filter.keyword },
      },
    ];
  }

  return condition;
}

export const createPassiveIncome = async (passiveIncome: CreatePassiveIncomeDtoWithUserId): Promise<PassiveIncome> => {
  return prisma.passiveIncome.create({
    data: {
      userId: passiveIncome.userId,
      date: passiveIncome.date,
      title: passiveIncome.title,
      amount: passiveIncome.amount,
      type: passiveIncome.type || null,
    }
  });
};

export const updatePassiveIncome = async (id: number, passiveIncome: CreatePassiveIncomeDtoWithUserId): Promise<PassiveIncome> => {
  return prisma.passiveIncome.update({
    where: { id },
    data: {
      userId: passiveIncome.userId,
      date: passiveIncome.date,
      title: passiveIncome.title,
      amount: passiveIncome.amount,
      type: passiveIncome.type || null,
    }
  })
};

export const findPassiveIncomes = async (filter: FilterPassiveIncomeDto): Promise<PassiveIncome[]> => {
  return prisma.passiveIncome.findMany({
    where: getPassiveIncomeWhere(filter),
    orderBy: [
      { date: 'desc' },
      { createdAt: 'asc' },
    ]
  })
};

export const getPassiveIncomeById = async (id: number, userId: number) => {
  return prisma.passiveIncome.findUnique({
    where: {
      id,
      userId
    }
  });
}

export const findTotalPassiveIncome = async (filter: FilterPassiveIncomeDto): Promise<number | null> => {
  const aggregations = await prisma.passiveIncome.aggregate({
    _sum: {
      amount: true,
    },
    where: getPassiveIncomeWhere(filter)
  });

  return aggregations._sum.amount;
}

export const deletePassiveIncome = async (id: number): Promise<PassiveIncome> => {
  return prisma.passiveIncome.delete({
    where: { id }
  })
}

export const findMonthlyPassiveIncome = async ({ userId, from, to }: FilterMonthlyPassiveIncomeDto): Promise<number> => {
  const total = await findTotalPassiveIncome({
    userId, from, to
  }) || 0;

  return total;
}