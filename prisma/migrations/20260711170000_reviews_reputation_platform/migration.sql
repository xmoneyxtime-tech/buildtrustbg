-- Reviews & Reputation Platform

CREATE TYPE "VerificationType" AS ENUM ('COMPANY', 'IDENTITY', 'PHONE', 'DOCUMENT');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN', 'DELETED');
CREATE TYPE "ReviewReportReason" AS ENUM ('SPAM', 'ABUSE', 'OFF_TOPIC', 'FAKE', 'CONFLICT_OF_INTEREST', 'OTHER');
CREATE TYPE "ReviewReportStatus" AS ENUM ('OPEN', 'RESOLVED', 'REJECTED');
CREATE TYPE "ReviewReactionType" AS ENUM ('HELPFUL', 'NOT_HELPFUL');
CREATE TYPE "ReviewModerationAction" AS ENUM ('APPROVE', 'HIDE', 'DELETE', 'RESTORE', 'FLAG', 'REPORT_RESOLVED', 'REPORT_REJECTED');

CREATE TABLE "Verification" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "type" "VerificationType" NOT NULL,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "reference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "verificationId" TEXT,
  "rating" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "isSpam" BOOLEAN NOT NULL DEFAULT false,
  "spamScore" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "approvedAt" TIMESTAMP(3),
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewReply" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReviewReply_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewReport" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "reporterId" TEXT NOT NULL,
  "resolvedById" TEXT,
  "reason" "ReviewReportReason" NOT NULL,
  "details" TEXT,
  "status" "ReviewReportStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewReaction" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "ReviewReactionType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewReaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewAttachment" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "mimeType" TEXT,
  "fileSize" INTEGER,
  "altText" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewModerationLog" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "action" "ReviewModerationAction" NOT NULL,
  "reason" TEXT,
  "fromStatus" "ReviewStatus",
  "toStatus" "ReviewStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewModerationLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Review_userId_projectId_key" ON "Review"("userId", "projectId");
CREATE INDEX "Review_companyId_status_createdAt_idx" ON "Review"("companyId", "status", "createdAt");
CREATE INDEX "Review_projectId_status_idx" ON "Review"("projectId", "status");

CREATE UNIQUE INDEX "ReviewReply_reviewId_key" ON "ReviewReply"("reviewId");
CREATE INDEX "ReviewReply_companyId_createdAt_idx" ON "ReviewReply"("companyId", "createdAt");

CREATE UNIQUE INDEX "ReviewReport_reviewId_reporterId_key" ON "ReviewReport"("reviewId", "reporterId");
CREATE INDEX "ReviewReport_status_createdAt_idx" ON "ReviewReport"("status", "createdAt");

CREATE UNIQUE INDEX "ReviewReaction_reviewId_userId_key" ON "ReviewReaction"("reviewId", "userId");
CREATE INDEX "ReviewReaction_reviewId_type_idx" ON "ReviewReaction"("reviewId", "type");

CREATE INDEX "ReviewAttachment_reviewId_order_idx" ON "ReviewAttachment"("reviewId", "order");

CREATE INDEX "ReviewModerationLog_reviewId_createdAt_idx" ON "ReviewModerationLog"("reviewId", "createdAt");
CREATE INDEX "ReviewModerationLog_adminId_createdAt_idx" ON "ReviewModerationLog"("adminId", "createdAt");

CREATE INDEX "Verification_companyId_status_idx" ON "Verification"("companyId", "status");

ALTER TABLE "Verification"
  ADD CONSTRAINT "Verification_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "CompanyApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "CompanyApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review"
  ADD CONSTRAINT "Review_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review"
  ADD CONSTRAINT "Review_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review"
  ADD CONSTRAINT "Review_verificationId_fkey"
  FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReviewReply"
  ADD CONSTRAINT "ReviewReply_reviewId_fkey"
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewReply"
  ADD CONSTRAINT "ReviewReply_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "CompanyApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewReply"
  ADD CONSTRAINT "ReviewReply_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReviewReport"
  ADD CONSTRAINT "ReviewReport_reviewId_fkey"
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewReport"
  ADD CONSTRAINT "ReviewReport_reporterId_fkey"
  FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewReport"
  ADD CONSTRAINT "ReviewReport_resolvedById_fkey"
  FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReviewReaction"
  ADD CONSTRAINT "ReviewReaction_reviewId_fkey"
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewReaction"
  ADD CONSTRAINT "ReviewReaction_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReviewAttachment"
  ADD CONSTRAINT "ReviewAttachment_reviewId_fkey"
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReviewModerationLog"
  ADD CONSTRAINT "ReviewModerationLog_reviewId_fkey"
  FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewModerationLog"
  ADD CONSTRAINT "ReviewModerationLog_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
