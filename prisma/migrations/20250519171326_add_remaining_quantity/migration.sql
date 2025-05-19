-- AlterTable
ALTER TABLE "Drugs" ADD COLUMN     "remainingQuantity" INTEGER;

-- AlterTable
ALTER TABLE "WardAssignment" ALTER COLUMN "registrationId" SET DATA TYPE TEXT;
