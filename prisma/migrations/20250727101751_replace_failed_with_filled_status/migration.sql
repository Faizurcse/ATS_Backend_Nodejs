/*
  Warnings:

  - The values [FAILED] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED', 'FILLED');
ALTER TABLE "Ats_JobPost" ALTER COLUMN "jobStatus" DROP DEFAULT;
ALTER TABLE "Ats_JobPost" ALTER COLUMN "jobStatus" TYPE "JobStatus_new" USING ("jobStatus"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "JobStatus_old";
ALTER TABLE "Ats_JobPost" ALTER COLUMN "jobStatus" SET DEFAULT 'ACTIVE';
COMMIT;
