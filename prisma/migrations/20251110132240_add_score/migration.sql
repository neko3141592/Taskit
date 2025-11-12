/*
  Warnings:

  - A unique constraint covering the columns `[testId,userId,subjectId]` on the table `scores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "maxValue" INTEGER NOT NULL DEFAULT 100;

-- CreateIndex
CREATE UNIQUE INDEX "scores_testId_userId_subjectId_key" ON "scores"("testId", "userId", "subjectId");
