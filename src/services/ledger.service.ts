import {Ledger, PrismaClient} from "@prisma/client";
import {CreateLedgerDto} from "../dtos/CreateLedger.dto";
import {findTotalByPaymentType} from "./expense.service";
import {PAY_TYPE_GROUP} from "../lib/constants";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const createLedger = async (data: CreateLedgerDto): Promise<Ledger> => {
  const from = dayjs(data.date).startOf('month').format('YYYY-MM-DD');
  const to = dayjs(data.date).endOf('month').format('YYYY-MM-DD');

  const totalCash = await findTotalByPaymentType({
    userId: data.userId,
    type: PAY_TYPE_GROUP.CASH,
    from,
    to
  }) as number;

  const totalBank = await findTotalByPaymentType({
    userId: data.userId,
    type: PAY_TYPE_GROUP.BANK,
    from,
    to
  }) as number;

  const monthlyCost = data.budget + data.parentSupport + totalBank;

  return prisma.ledger.create({
    data: {
      userId: data.userId,
      date: new Date(data.date),
      current: data.current,
      income: data.income,
      parentSupport: data.parentSupport,
      budget: data.budget,
      grossSaving: data.income - (data.parentSupport + data.budget),
      expenseCash: totalCash,
      expenseBank: totalBank,
      cost: monthlyCost,
      netSaving: data.income - monthlyCost,
      balance: data.current - monthlyCost
    }
  });
}
