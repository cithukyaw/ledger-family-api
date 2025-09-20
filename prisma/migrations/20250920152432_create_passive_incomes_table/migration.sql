-- CreateTable
CREATE TABLE "passive_incomes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "passive_incomes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passive_incomes" ADD CONSTRAINT "passive_incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
