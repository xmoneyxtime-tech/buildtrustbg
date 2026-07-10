-- Trust Score Foundation fields for deterministic database-driven scoring
ALTER TABLE "CompanyApplication"
ADD COLUMN "slug" TEXT,
ADD COLUMN "industry" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "coverUrl" TEXT,
ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "identityVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "portfolioCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "projectsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "reviewsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "yearsInBusiness" INTEGER,
ADD COLUMN "certificatesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "galleryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "responseTimeHours" INTEGER,
ADD COLUMN "activeSubscription" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "CompanyApplication_slug_key" ON "CompanyApplication"("slug");
