import {Ledger, PrismaClient} from "@prisma/client";
import {UpsertLedgerDto} from "../dtos/UpsertLedgerDto";
import {findMonthlyExpenses} from "./expense.service";
import {findMonthlyPassiveIncome} from "./passiveIncome.service";
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
    // find ledger by id
    ledger = await prisma.ledger.findUnique({
      where: { id: data.id }
    })
  } else {
    // find ledger by userId and date
    ledger = await findLedger(data.userId, from);
  }

  const { totalCash, totalBank } = await findMonthlyExpenses({ userId: data.userId, from, to});
  const passiveIncome = await findMonthlyPassiveIncome({ userId: data.userId, from, to });

  const incomePenny   = data.incomePenny ? data.incomePenny : 0;
  const budget        = data.budget ? data.budget : data.income - data.parentSupport - incomePenny;
  const monthlyCost   = budget + data.parentSupport + totalBank;
  const closingBalance= data.current + data.income - monthlyCost;
  const netSaving     = data.income - monthlyCost;

  const upsertData = {
    date: from,
    current: data.current,
    income: data.income,
    incomePenny,
    parentSupport: data.parentSupport,
    budget,
    grossSaving: data.income - (data.parentSupport + budget),
    expenseCash: totalCash,
    expenseBank: totalBank,
    cost: monthlyCost,
    passiveIncome,
    netSaving,
    totalSaving: netSaving + passiveIncome,
    balance: closingBalance,
    nextOpening: closingBalance + passiveIncome,
    exchangeRate: data.exchangeRate || null,
    currency: data.currency || null,
    remarks: data.remarks || null,
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
      data: { ...upsertData, userId: data.userId }
    });
  }
}

/**
 * Update ledger whenever expenses or passive income are added, updated or deleted
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
  const monthlyPassiveIncome = await findMonthlyPassiveIncome({ userId, from, to });
  const monthlyCost = ledger.budget + ledger.parentSupport + totalBank;
  const balance = ledger.current + ledger.income - monthlyCost;

  return prisma.ledger.update({
    where: {
      id: ledger.id
    },
    data: {
      expenseCash: totalCash,
      expenseBank: totalBank,
      cost: monthlyCost,
      passiveIncome: monthlyPassiveIncome,
      netSaving: ledger.income - monthlyCost,
      balance: balance,
      nextOpening: balance + monthlyPassiveIncome
    }
  });
}
