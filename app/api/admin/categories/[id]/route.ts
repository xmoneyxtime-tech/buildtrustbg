import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ensureCoreLocales,
  normalizeTranslations,
  parseStringArray,
  sanitizeSlug,
} from "@/app/lib/categories/shared";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateCategoryBody = {
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

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  let body: UpdateCategoryBody;
  try {
    body = (await request.json()) as UpdateCategoryBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (body.parentId === id) {
    return NextResponse.json({ error: "Category cannot be its own parent" }, { status: 400 });
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

  const translations = body.translations !== undefined
    ? normalizeTranslations(body.translations)
    : existing.translations.map((item) => ({
        locale: item.locale,
        name: item.name,
        description: item.description,
        seoSlug: item.seoSlug,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
      }));

  if (!ensureCoreLocales(translations)) {
    return NextResponse.json(
      { error: "Translations for bg and en are required" },
      { status: 400 }
    );
  }

  const slug = body.slug !== undefined ? sanitizeSlug(body.slug) : undefined;
  const fallbackName =
    translations.find((item) => item.locale === "bg")?.name ||
    translations[0]?.name ||
    existing.name;
  const fallbackDescription =
    translations.find((item) => item.locale === "bg")?.description ||
    translations[0]?.description ||
    existing.description;

  try {
    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: {
          slug,
          icon: typeof body.icon === "string" ? body.icon.trim() : undefined,
          image: body.image !== undefined ? body.image || null : undefined,
          name: fallbackName,
          description: fallbackDescription,
          featured: typeof body.featured === "boolean" ? body.featured : undefined,
          popular: typeof body.popular === "boolean" ? body.popular : undefined,
          premiumOnly: typeof body.premiumOnly === "boolean" ? body.premiumOnly : undefined,
          searchKeywords: body.searchKeywords !== undefined ? parseStringArray(body.searchKeywords) : undefined,
          synonyms: body.synonyms !== undefined ? parseStringArray(body.synonyms) : undefined,
          parentId: body.parentId !== undefined ? body.parentId || null : undefined,
          sortOrder:
            typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
              ? body.sortOrder
              : undefined,
          isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
        },
      });

      await tx.categoryTranslation.deleteMany({
        where: {
          categoryId: id,
        },
      });

      await tx.categoryTranslation.createMany({
        data: translations.map((item) => ({
          categoryId: id,
          locale: item.locale,
          name: item.name,
          description: item.description,
          seoSlug: item.seoSlug,
          metaTitle: item.metaTitle,
          metaDescription: item.metaDescription,
        })),
      });

      const full = await tx.category.findUnique({
        where: {
          id: updated.id,
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

      return full;
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "Category slug already exists"
        : "Unable to update category";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
