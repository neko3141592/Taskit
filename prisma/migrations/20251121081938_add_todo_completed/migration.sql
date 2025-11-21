/*
  Warnings:

  - A unique constraint covering the columns `[testId,step]` on the table `todos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "todos_testId_step_key" ON "todos"("testId", "step");
