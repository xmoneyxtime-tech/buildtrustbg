import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listLocalizedCategories } from "@/app/lib/categories/service";
import {
  ensureCoreLocales,
  normalizeTranslations,
  parseStringArray,
  sanitizeSlug,
} from "@/app/lib/categories/shared";

type CreateCategoryBody = {
  slug?: string;
  icon?: string;
  image?: string | null;
  featured?: boolean;
  popular?: boolean;
  premiumOnly?: boolean;
  searchKeywords?: unknown;
  synonyms?: unknown;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  translations?: unknown;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const locale = searchParams.get("locale");

  const result = await listLocalizedCategories({
    locale,
    onlyActive: false,
    search,
  });

  return NextResponse.json({ categories: result.categories }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: CreateCategoryBody;

  try {
    body = (await request.json()) as CreateCategoryBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const translations = normalizeTranslations(body.translations);

  if (!ensureCoreLocales(translations)) {
    return NextResponse.json(
      { error: "Translations for bg and en are required" },
      { status: 400 }
    );
  }

  const fallbackName = translations.find((item) => item.locale === "bg")?.name || translations[0]?.name || "";
  const fallbackDescription =
    translations.find((item) => item.locale === "bg")?.description || translations[0]?.description || "";
  const slug = sanitizeSlug(body.slug || fallbackName);
  const icon = (body.icon || "🏷️").trim();

  if (!slug || !icon) {
    return NextResponse.json({ error: "slug and icon are required" }, { status: 400 });
  }

  if (body.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: body.parentId },
      select: { id: true },
    });

    if (!parent) {
      return NextResponse.json({ error: "Invalid parent category" }, { status: 400 });
    }
  }

  try {
    const category = await prisma.category.create({
      data: {
        slug,
        icon,
        image: body.image || null,
        name: fallbackName,
        description: fallbackDescription,
        featured: Boolean(body.featured),
        popular: Boolean(body.popular),
        premiumOnly: Boolean(body.premiumOnly),
        searchKeywords: parseStringArray(body.searchKeywords),
        synonyms: parseStringArray(body.synonyms),
        parentId: body.parentId || null,
        sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
        isActive: typeof body.isActive === "boolean" ? body.isActive : true,
        translations: {
          create: translations,
        },
      },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
          },
        },
        translations: {
          orderBy: {
            locale: "asc",
          },
        },
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "Category slug already exists"
        : "Unable to create category";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
