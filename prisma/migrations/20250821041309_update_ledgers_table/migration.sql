-- AlterTable
ALTER TABLE "ledgers" ADD COLUMN     "income_penny" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "next_opening" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passive_income" INTEGER NOT NULL DEFAULT 0;
