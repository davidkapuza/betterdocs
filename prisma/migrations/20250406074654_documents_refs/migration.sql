-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
