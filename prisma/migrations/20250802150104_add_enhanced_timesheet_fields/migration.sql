/*
  Warnings:

  - Added the required column `entityName` to the `TimesheetEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recruiterName` to the `TimesheetEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('RECRUITMENT', 'CLIENT_MANAGEMENT', 'ADMINISTRATIVE', 'TRAINING', 'MEETING', 'RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TimesheetStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUBMITTED');

-- AlterTable
ALTER TABLE "TimesheetEntry" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "attachments" TEXT,
ADD COLUMN     "billable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "billableRate" DECIMAL(8,2),
ADD COLUMN     "breakTime" DECIMAL(3,2),
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "entityName" TEXT,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "recruiterEmail" TEXT,
ADD COLUMN     "recruiterName" TEXT,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "status" "TimesheetStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "taskCategory" "TaskCategory" NOT NULL DEFAULT 'RECRUITMENT';

-- Update existing records with default values
UPDATE "TimesheetEntry" SET 
    "recruiterName" = 'Unknown Recruiter',
    "entityName" = 'Unknown Entity'
WHERE "recruiterName" IS NULL OR "entityName" IS NULL;

-- Make the columns NOT NULL after updating
ALTER TABLE "TimesheetEntry" ALTER COLUMN "recruiterName" SET NOT NULL;
ALTER TABLE "TimesheetEntry" ALTER COLUMN "entityName" SET NOT NULL;
