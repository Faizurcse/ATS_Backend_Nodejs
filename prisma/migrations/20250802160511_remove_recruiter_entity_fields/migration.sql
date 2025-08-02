/*
  Warnings:

  - You are about to drop the column `entityId` on the `TimesheetEntry` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `TimesheetEntry` table. All the data in the column will be lost.
  - You are about to drop the column `recruiterId` on the `TimesheetEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimesheetEntry" DROP COLUMN "entityId",
DROP COLUMN "entityName",
DROP COLUMN "recruiterId";
