/*
  Warnings:

  - You are about to drop the column `version` on the `documents` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "documents_version_key";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "version";
