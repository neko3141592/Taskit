-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_testId_fkey";

-- CreateTable
CREATE TABLE "_TaskToTest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskToTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SubjectToTest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskToTest_B_index" ON "_TaskToTest"("B");

-- CreateIndex
CREATE INDEX "_SubjectToTest_B_index" ON "_SubjectToTest"("B");

-- AddForeignKey
ALTER TABLE "_TaskToTest" ADD CONSTRAINT "_TaskToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToTest" ADD CONSTRAINT "_TaskToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTest" ADD CONSTRAINT "_SubjectToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTest" ADD CONSTRAINT "_SubjectToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
