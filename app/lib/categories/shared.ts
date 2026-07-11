export const DEFAULT_CATEGORY_LOCALE = "bg";
export const FALLBACK_CATEGORY_LOCALE = "en";

export type CategoryLocale = string;

export type CategoryTranslationInput = {
  locale: CategoryLocale;
  name: string;
  description: string;
  seoSlug: string;
  metaTitle: string;
  metaDescription: string;
};

export type CategoryMutationInput = {
  slug: string;
  icon: string;
  image?: string | null;
  featured: boolean;
  popular: boolean;
  premiumOnly: boolean;
  searchKeywords: string[];
  synonyms: string[];
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  translations: CategoryTranslationInput[];
};

export function sanitizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeLocale(value: string | null | undefined): string {
  const normalized = (value || DEFAULT_CATEGORY_LOCALE).trim().toLowerCase();
  if (!normalized) {
    return DEFAULT_CATEGORY_LOCALE;
  }
  return normalized;
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

export function normalizeTranslations(value: unknown): CategoryTranslationInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: CategoryTranslationInput[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const locale = normalizeLocale(typeof record.locale === "string" ? record.locale : DEFAULT_CATEGORY_LOCALE);
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const description = typeof record.description === "string" ? record.description.trim() : "";
    const seoSlug = sanitizeSlug(
      typeof record.seoSlug === "string" ? record.seoSlug : name
    );
    const metaTitle = typeof record.metaTitle === "string" ? record.metaTitle.trim() : "";
    const metaDescription = typeof record.metaDescription === "string" ? record.metaDescription.trim() : "";

    if (!name || !description || !seoSlug || !metaTitle || !metaDescription) {
      continue;
    }

    entries.push({
      locale,
      name,
      description,
      seoSlug,
      metaTitle,
      metaDescription,
    });
  }

  const uniqueByLocale = new Map<string, CategoryTranslationInput>();
  for (const item of entries) {
    uniqueByLocale.set(item.locale, item);
  }

  return [...uniqueByLocale.values()];
}

export function ensureCoreLocales(translations: CategoryTranslationInput[]): boolean {
  const locales = new Set(translations.map((item) => item.locale));
  return locales.has("bg") && locales.has("en");
}
