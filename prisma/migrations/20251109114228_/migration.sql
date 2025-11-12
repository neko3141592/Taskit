/*
  Warnings:

  - You are about to drop the `_SubjectToTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_SubjectToTest" DROP CONSTRAINT "_SubjectToTest_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SubjectToTest" DROP CONSTRAINT "_SubjectToTest_B_fkey";

-- DropTable
DROP TABLE "public"."_SubjectToTest";
