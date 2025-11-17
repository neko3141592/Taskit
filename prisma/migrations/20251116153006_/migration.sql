-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "tips" JSONB NOT NULL,
    "resources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "study_plans_taskId_key" ON "study_plans"("taskId");

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
