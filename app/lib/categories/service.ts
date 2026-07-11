import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  DEFAULT_CATEGORY_LOCALE,
  FALLBACK_CATEGORY_LOCALE,
  normalizeLocale,
} from "./shared";

type RawCategory = Prisma.CategoryGetPayload<{
  include: {
    parent: {
      select: {
        id: true;
        slug: true;
      };
    };
    translations: true;
  };
}>;

type CategoryTranslation = {
  locale: string;
  name: string;
  description: string;
  seoSlug: string;
  metaTitle: string;
  metaDescription: string;
};

function resolveTranslation(
  translations: CategoryTranslation[],
  locale: string,
  fallbackName: string,
  fallbackDescription: string
) {
  const selected =
    translations.find((item) => item.locale === locale) ||
    translations.find((item) => item.locale === DEFAULT_CATEGORY_LOCALE) ||
    translations.find((item) => item.locale === FALLBACK_CATEGORY_LOCALE) ||
    translations[0];

  return {
    locale: selected?.locale || locale,
    name: selected?.name || fallbackName,
    description: selected?.description || fallbackDescription,
    seoSlug: selected?.seoSlug || "",
    metaTitle: selected?.metaTitle || "",
    metaDescription: selected?.metaDescription || "",
  };
}

function toCategoryDto(category: RawCategory, locale: string) {
  const translation = resolveTranslation(
    category.translations as CategoryTranslation[],
    locale,
    category.name,
    category.description
  );

  return {
    id: category.id,
    slug: category.slug,
    icon: category.icon,
    image: category.image,
    featured: category.featured,
    popular: category.popular,
    premiumOnly: category.premiumOnly,
    searchKeywords: category.searchKeywords,
    synonyms: category.synonyms,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    locale: translation.locale,
    name: translation.name,
    description: translation.description,
    seoSlug: translation.seoSlug,
    metaTitle: translation.metaTitle,
    metaDescription: translation.metaDescription,
    translations: category.translations,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function buildCategoryTree<T extends { id: string; parentId: string | null }>(nodes: T[]) {
  const byParent = new Map<string | null, T[]>();

  for (const node of nodes) {
    const key = node.parentId;
    const bucket = byParent.get(key) || [];
    bucket.push(node);
    byParent.set(key, bucket);
  }

  const build = (parentId: string | null): Array<T & { children: Array<T & { children: any[] }> }> => {
    const list = byParent.get(parentId) || [];
    return list.map((item) => ({
      ...item,
      children: build(item.id),
    }));
  };

  return build(null);
}

export function getCategoryBreadcrumbs(
  categoryId: string,
  categoryMap: Map<string, { id: string; parentId: string | null; name: string; slug: string }>
) {
  const trail: Array<{ id: string; name: string; slug: string }> = [];
  let current = categoryMap.get(categoryId);
  const visited = new Set<string>();

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    trail.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parentId ? categoryMap.get(current.parentId) : undefined;
  }

  return trail;
}

export async function listLocalizedCategories(options?: {
  locale?: string | null;
  onlyActive?: boolean;
  search?: string;
  featured?: boolean;
  popular?: boolean;
  premiumOnly?: boolean;
}) {
  const locale = normalizeLocale(options?.locale);
  const search = options?.search?.trim();

  const categories = await prisma.category.findMany({
    where: {
      isActive: options?.onlyActive !== false,
      featured: options?.featured === undefined ? undefined : options.featured,
      popular: options?.popular === undefined ? undefined : options.popular,
      premiumOnly: options?.premiumOnly === undefined ? undefined : options.premiumOnly,
      ...(search
        ? {
            OR: [
              { slug: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { translations: { some: { name: { contains: search, mode: "insensitive" } } } },
              { translations: { some: { description: { contains: search, mode: "insensitive" } } } },
              { searchKeywords: { hasSome: [search] } },
              { synonyms: { hasSome: [search] } },
            ],
          }
        : {}),
    },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { slug: "asc" }],
    include: {
      parent: {
        select: {
          id: true,
          slug: true,
        },
      },
      translations: {
        where: {
          locale: {
            in: [locale, DEFAULT_CATEGORY_LOCALE, FALLBACK_CATEGORY_LOCALE],
          },
        },
        orderBy: {
          locale: "asc",
        },
      },
    },
  });

  return {
    locale,
    categories: categories.map((item) => toCategoryDto(item, locale)),
  };
}
