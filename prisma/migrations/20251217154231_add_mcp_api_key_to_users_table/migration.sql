/*
  Warnings:

  - A unique constraint covering the columns `[mcp_api_key]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mcp_api_key" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "users_mcp_api_key_key" ON "users"("mcp_api_key");
