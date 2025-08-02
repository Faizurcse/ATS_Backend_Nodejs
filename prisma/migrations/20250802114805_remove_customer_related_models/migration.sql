/*
  Warnings:

  - You are about to drop the `CustomerCommunication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerContract` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerCommunication" DROP CONSTRAINT "CustomerCommunication_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerContact" DROP CONSTRAINT "CustomerContact_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerContract" DROP CONSTRAINT "CustomerContract_customerId_fkey";

-- DropTable
DROP TABLE "CustomerCommunication";

-- DropTable
DROP TABLE "CustomerContact";

-- DropTable
DROP TABLE "CustomerContract";

-- DropEnum
DROP TYPE "CommunicationDirection";

-- DropEnum
DROP TYPE "CommunicationStatus";

-- DropEnum
DROP TYPE "CommunicationType";

-- DropEnum
DROP TYPE "ContractStatus";
