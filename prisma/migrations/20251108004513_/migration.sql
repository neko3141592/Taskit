-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "notificationDaysBefore" INTEGER DEFAULT 3,
ADD COLUMN     "notified" BOOLEAN NOT NULL DEFAULT false;
