-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('CUSTOMER', 'JOB', 'CANDIDATE');

-- CreateTable
CREATE TABLE "TimesheetEntry" (
    "id" SERIAL NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hours" DECIMAL(4,2) NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimesheetEntry_pkey" PRIMARY KEY ("id")
); 