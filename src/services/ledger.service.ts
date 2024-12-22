import {Ledger, PrismaClient} from "@prisma/client";
import {UpsertLedgerDto} from "../dtos/UpsertLedgerDto";
import {findMonthlyExpenses} from "./expense.service";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const findLedger = async (userId: number, date: string): Promise<Ledger | null> => {
  return prisma.ledger.findFirst({
    where: {
      userId: userId,
      date,
    }
  });
}

export const upsertLedger = async (data: UpsertLedgerDto): Promise<Ledger> => {
  const from = dayjs(data.date).startOf('month').format('YYYY-MM-DD');
  const to = dayjs(data.date).endOf('month').format('YYYY-MM-DD');

  let ledger;
  if (data.id) {
    console.log('find ledger by id');
    // find ledger by id
    ledger = await prisma.ledger.findUnique({
      where: { id: data.id }
    })
  } else {
    // find ledger by userId and date
    ledger = await findLedger(data.userId, from);
  }

  const { totalCash, totalBank } = await findMonthlyExpenses({
    userId: data.userId,
    from,
    to
  });

  const monthlyCost = data.budget + data.parentSupport + totalBank;

  const upsertData = {
    userId: data.userId,
    date: from,
    current: data.current,
    income: data.income,
    parentSupport: data.parentSupport,
    budget: data.budget,
    grossSaving: data.income - (data.parentSupport + data.budget),
    expenseCash: totalCash,
    expenseBank: totalBank,
    cost: monthlyCost,
    netSaving: data.income - monthlyCost,
    balance: data.current - monthlyCost,
    exchangeRate: data.exchangeRate || null,
    currency: data.currency || null,
  };

  if (ledger) {
    return prisma.ledger.update({
      where: {
        id: ledger.id
      },
      data: upsertData
    });
  } else {
    return prisma.ledger.create({
      data: upsertData
    });
  }
}

/**
 * Update ledger whenever expenses are added, updated or deleted
 */
export const updateLedger = async (userId: number, date: string): Promise<Ledger | null> => {
  const from = dayjs(date).startOf('month').format('YYYY-MM-DD');
  const to = dayjs(date).endOf('month').format('YYYY-MM-DD');

  const ledger = await prisma.ledger.findFirst({
    where: {
      userId,
      date: from,
    }
  });

  if (!ledger) {
    return null;
  }

  const { totalCash, totalBank } = await findMonthlyExpenses({ userId, from, to });
  const monthlyCost = ledger.budget + ledger.parentSupport + totalBank;

  return prisma.ledger.update({
    where: {
      id: ledger.id
    },
    data: {
      expenseCash: totalCash,
      expenseBank: totalBank,
      cost: monthlyCost,
      netSaving: ledger.income - monthlyCost,
      balance: ledger.current - monthlyCost
    }
  });
}
