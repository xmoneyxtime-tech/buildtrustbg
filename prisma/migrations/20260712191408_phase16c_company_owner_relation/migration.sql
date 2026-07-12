-- AlterTable
ALTER TABLE "CompanyApplication" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "CompanyApplication_ownerId_idx" ON "CompanyApplication"("ownerId");

-- AddForeignKey
ALTER TABLE "CompanyApplication" ADD CONSTRAINT "CompanyApplication_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
