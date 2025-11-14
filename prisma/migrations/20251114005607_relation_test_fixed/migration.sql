/*
  Warnings:

  - You are about to drop the `_TaskToTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_TaskToTest" DROP CONSTRAINT "_TaskToTest_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TaskToTest" DROP CONSTRAINT "_TaskToTest_B_fkey";

-- DropTable
DROP TABLE "public"."_TaskToTest";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
