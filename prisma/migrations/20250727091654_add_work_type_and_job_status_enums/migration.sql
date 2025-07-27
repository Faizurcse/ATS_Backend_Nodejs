/*
  Warnings:

  - The `workType` column on the `Ats_JobPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('ONSITE', 'REMOTE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED', 'FAILED');

-- AlterTable
ALTER TABLE "Ats_JobPost" ADD COLUMN     "jobStatus" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "workType",
ADD COLUMN     "workType" "WorkType" NOT NULL DEFAULT 'ONSITE';
