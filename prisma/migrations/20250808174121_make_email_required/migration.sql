/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `submittedBy` on the `CandidateApplication` table. All the data in the column will be lost.
  - Made the column `email` on table `Ats_JobPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ats_JobPost" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "CandidateApplication" DROP COLUMN "approvedAt",
DROP COLUMN "approvedBy",
DROP COLUMN "attachments",
DROP COLUMN "submittedAt",
DROP COLUMN "submittedBy";
