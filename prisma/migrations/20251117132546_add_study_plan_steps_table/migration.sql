/*
  Warnings:

  - You are about to drop the column `steps` on the `study_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "study_plans" DROP COLUMN "steps";

-- CreateTable
CREATE TABLE "study_plan_steps" (
    "id" TEXT NOT NULL,
    "studyPlanId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_steps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "study_plan_steps" ADD CONSTRAINT "study_plan_steps_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
