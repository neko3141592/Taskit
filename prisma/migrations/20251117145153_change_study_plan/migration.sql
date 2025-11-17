/*
  Warnings:

  - You are about to drop the column `taskId` on the `study_plans` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testId]` on the table `study_plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `testId` to the `study_plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."study_plans" DROP CONSTRAINT "study_plans_taskId_fkey";

-- DropIndex
DROP INDEX "public"."study_plans_taskId_key";

-- AlterTable
ALTER TABLE "study_plans" DROP COLUMN "taskId",
ADD COLUMN     "testId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "study_plans_testId_key" ON "study_plans"("testId");

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
