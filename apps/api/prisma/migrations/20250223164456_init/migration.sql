-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;
