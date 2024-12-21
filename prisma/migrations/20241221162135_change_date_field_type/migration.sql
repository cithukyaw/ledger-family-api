/*
  - Changed the type of `date` on the `expenses` table.
  - Changed the type of `date` on the `ledgers` table.
*/

-- AlterTable
ALTER TABLE expenses ALTER COLUMN "date" TYPE VARCHAR(10);
ALTER TABLE ledgers ALTER COLUMN "date" TYPE VARCHAR(10);
