/*
  Warnings:

  - You are about to drop the column `discount` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `discount_amount` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "discount",
ADD COLUMN     "discount_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "discount_id" INTEGER;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "fb_token" DROP NOT NULL,
ALTER COLUMN "gmail_token" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
