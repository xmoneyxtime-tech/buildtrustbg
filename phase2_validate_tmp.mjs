import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const totalCategories = await prisma.category.count();
  const categoriesWithoutBg = await prisma.category.count({
    where: { translations: { none: { locale: 'bg' } } },
  });
  const categoriesWithoutEn = await prisma.category.count({
    where: { translations: { none: { locale: 'en' } } },
  });
  const categoriesWithMissingSlug = await prisma.category.count({
    where: { OR: [{ slug: '' }, { slug: null }] },
  });

  const duplicateSlugGroups = await prisma.category.groupBy({
    by: ['slug'],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  const orphanRows = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count
    FROM "Category" c
    LEFT JOIN "Category" p ON p."id" = c."parentId"
    WHERE c."parentId" IS NOT NULL AND p."id" IS NULL
  `;

  const translationsTotal = await prisma.categoryTranslation.count();
  const bgTranslations = await prisma.categoryTranslation.count({ where: { locale: 'bg' } });
  const enTranslations = await prisma.categoryTranslation.count({ where: { locale: 'en' } });

  console.log(
    JSON.stringify(
      {
        totalCategories,
        translationsTotal,
        bgTranslations,
        enTranslations,
        categoriesWithoutBg,
        categoriesWithoutEn,
        categoriesWithMissingSlug,
        duplicateSlugGroups: duplicateSlugGroups.length,
        orphanCategories: orphanRows[0]?.count ?? 0,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
