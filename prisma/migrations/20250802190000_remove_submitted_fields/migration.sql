-- AlterTable
-- Only drop submittedAt if it exists, skip submittedBy as it doesn't exist
ALTER TABLE "TimesheetEntry" DROP COLUMN IF EXISTS "submittedAt"; 