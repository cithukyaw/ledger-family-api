import {PassiveIncome, Prisma} from "../generated/prisma/client.js";
import {prisma} from "../lib/prisma.js";
import {CreatePassiveIncomeDtoWithUserId} from "../dtos/CreatePassiveIncome.dto.js";
import {FilterMonthlyPassiveIncomeDto, FilterPassiveIncomeDto} from "../dtos/FilterPassiveIncome.dto.js";


const getPassiveIncomeWhere = (filter: FilterPassiveIncomeDto): Prisma.PassiveIncomeWhereInput => {
  let condition: Prisma.PassiveIncomeWhereInput = {
    userId: filter.userId,
    date: {
      gte: filter.from,
      lte: filter.to,
    },
    deletedAt: null
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
    where: {
      id,
      deletedAt: null
    },
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
      userId,
      deletedAt: null
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
  return await findTotalPassiveIncome({
    userId, from, to
  }) || 0;
}
