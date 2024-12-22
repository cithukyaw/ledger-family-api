-- AlterTable
ALTER TABLE "ledgers" ADD COLUMN     "currency" VARCHAR(3),
ADD COLUMN     "exchange_rate" DOUBLE PRECISION;
