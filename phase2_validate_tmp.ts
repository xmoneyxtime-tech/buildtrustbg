import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

type Metrics = {
  totalCategories: number;
  translationsTotal: number;
  bgTranslations: number;
  enTranslations: number;
  categoriesWithoutBg: number;
  categoriesWithoutEn: number;
  categoriesWithMissingSlug: number;
  duplicateSlugGroups: number;
  orphanCategories: number;
};

async function collectMetrics(prisma: PrismaClient): Promise<Metrics> {
  const totalCategories = await prisma.category.count();
  const translationsTotal = await prisma.categoryTranslation.count();
  const bgTranslations = await prisma.categoryTranslation.count({ where: { locale: 'bg' } });
  const enTranslations = await prisma.categoryTranslation.count({ where: { locale: 'en' } });

  const categoriesWithoutBg = await prisma.category.count({
    where: { translations: { none: { locale: 'bg' } } },
  });
  const categoriesWithoutEn = await prisma.category.count({
    where: { translations: { none: { locale: 'en' } } },
  });
  const categoriesWithMissingSlug = await prisma.category.count({
    where: { slug: '' },
  });

  const duplicateSlugGroups = await prisma.category.groupBy({
    by: ['slug'],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  const orphanRows = await prisma.$queryRaw<Array<{ count: number }>>`
    SELECT COUNT(*)::int AS count
    FROM "Category" c
    LEFT JOIN "Category" p ON p."id" = c."parentId"
    WHERE c."parentId" IS NOT NULL AND p."id" IS NULL
  `;

  return {
    totalCategories,
    translationsTotal,
    bgTranslations,
    enTranslations,
    categoriesWithoutBg,
    categoriesWithoutEn,
    categoriesWithMissingSlug,
    duplicateSlugGroups: duplicateSlugGroups.length,
    orphanCategories: orphanRows[0]?.count ?? 0,
  };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const before = await collectMetrics(prisma);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "CategoryTranslation" (
      "id", "categoryId", "locale", "name", "description",
      "seoSlug", "metaTitle", "metaDescription", "createdAt", "updatedAt"
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
      now(), now()
    FROM "Category" c
    LEFT JOIN "CategoryTranslation" t
      ON t."categoryId" = c."id" AND t."locale" = 'bg'
    WHERE t."id" IS NULL;

    INSERT INTO "CategoryTranslation" (
      "id", "categoryId", "locale", "name", "description",
      "seoSlug", "metaTitle", "metaDescription", "createdAt", "updatedAt"
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
      now(), now()
    FROM "Category" c
    LEFT JOIN "CategoryTranslation" t
      ON t."categoryId" = c."id" AND t."locale" = 'en'
    WHERE t."id" IS NULL;

    UPDATE "Category" c
    SET
      "name" = t."name",
      "description" = t."description",
      "updatedAt" = now()
    FROM "CategoryTranslation" t
    WHERE t."categoryId" = c."id"
      AND t."locale" = 'bg'
      AND (c."name" IS DISTINCT FROM t."name" OR c."description" IS DISTINCT FROM t."description");
  `);

  const after = await collectMetrics(prisma);

  const delta = {
    totalCategories: after.totalCategories - before.totalCategories,
    translationsTotal: after.translationsTotal - before.translationsTotal,
    bgTranslations: after.bgTranslations - before.bgTranslations,
    enTranslations: after.enTranslations - before.enTranslations,
    categoriesWithoutBg: after.categoriesWithoutBg - before.categoriesWithoutBg,
    categoriesWithoutEn: after.categoriesWithoutEn - before.categoriesWithoutEn,
    categoriesWithMissingSlug: after.categoriesWithMissingSlug - before.categoriesWithMissingSlug,
    duplicateSlugGroups: after.duplicateSlugGroups - before.duplicateSlugGroups,
    orphanCategories: after.orphanCategories - before.orphanCategories,
  };

  console.log(JSON.stringify({ before, after, delta }, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
