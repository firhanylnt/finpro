/*
  Warnings:

  - You are about to drop the column `amount` on the `ProductDiscount` table. All the data in the column will be lost.
  - You are about to drop the column `amount_type` on the `ProductDiscount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductDiscount" DROP COLUMN "amount",
DROP COLUMN "amount_type";
