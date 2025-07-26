/*
  Warnings:

  - You are about to drop the column `candidateName` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `currentCompany` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `expectedSalary` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `CandidateApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `CandidateApplication` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `CandidateApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `CandidateApplication` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `CandidateApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CandidateApplication" DROP COLUMN "candidateName",
DROP COLUMN "currentCompany",
DROP COLUMN "expectedSalary",
DROP COLUMN "experience",
DROP COLUMN "githubUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "resumeUrl",
ADD COLUMN     "currentLocation" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "keySkills" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "noticePeriod" TEXT,
ADD COLUMN     "remoteWork" BOOLEAN,
ADD COLUMN     "resumeFilePath" TEXT,
ADD COLUMN     "salaryExpectation" INTEGER,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "yearsOfExperience" TEXT,
ALTER COLUMN "phone" SET NOT NULL;
