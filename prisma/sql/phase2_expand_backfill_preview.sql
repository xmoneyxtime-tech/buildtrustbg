-- Phase 2 (Expand) preview SQL.
-- This script is intentionally non-destructive: no DROP TABLE/COLUMN statements.
-- Review first, then execute manually only after explicit approval.

-- 1) Ensure BG translation exists for every existing category.
INSERT INTO "CategoryTranslation" (
  "id",
  "categoryId",
  "locale",
  "name",
  "description",
  "seoSlug",
  "metaTitle",
  "metaDescription",
  "createdAt",
  "updatedAt"
)
SELECT
  'ct_' || c."id" || '_bg',
  c."id",
  'bg',
  c."name",
  c."description",
  c."slug",
  c."name" || ' | BuildTrustBG',
  CASE
    WHEN length(c."description") > 155 THEN substring(c."description" from 1 for 152) || '...'
    ELSE c."description"
  END,
  now(),
  now()
FROM "Category" c
LEFT JOIN "CategoryTranslation" t
  ON t."categoryId" = c."id" AND t."locale" = 'bg'
WHERE t."id" IS NULL;

-- 2) Ensure EN translation exists for every existing category.
INSERT INTO "CategoryTranslation" (
  "id",
  "categoryId",
  "locale",
  "name",
  "description",
  "seoSlug",
  "metaTitle",
  "metaDescription",
  "createdAt",
  "updatedAt"
)
SELECT
  'ct_' || c."id" || '_en',
  c."id",
  'en',
  c."name",
  c."description",
  c."slug",
  c."name" || ' | BuildTrustBG',
  CASE
    WHEN length(c."description") > 155 THEN substring(c."description" from 1 for 152) || '...'
    ELSE c."description"
  END,
  now(),
  now()
FROM "Category" c
LEFT JOIN "CategoryTranslation" t
  ON t."categoryId" = c."id" AND t."locale" = 'en'
WHERE t."id" IS NULL;

-- 3) Keep legacy columns synchronized from BG translation for transition safety.
UPDATE "Category" c
SET
  "name" = t."name",
  "description" = t."description",
  "updatedAt" = now()
FROM "CategoryTranslation" t
WHERE t."categoryId" = c."id"
  AND t."locale" = 'bg'
  AND (c."name" IS DISTINCT FROM t."name" OR c."description" IS DISTINCT FROM t."description");
