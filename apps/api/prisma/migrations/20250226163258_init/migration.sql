/*
  Warnings:

  - You are about to drop the column `store_id` on the `ProductDiscount` table. All the data in the column will be lost.
  - Added the required column `discount_id` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_store_id_fkey";

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "store_id" INTEGER;

-- AlterTable
ALTER TABLE "ProductDiscount" DROP COLUMN "store_id",
ADD COLUMN     "discount_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
