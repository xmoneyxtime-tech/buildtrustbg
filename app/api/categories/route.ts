import { NextResponse } from "next/server";
import { buildCategoryTree, listLocalizedCategories } from "@/app/lib/categories/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const search = searchParams.get("search") || undefined;
  const onlyFeatured = searchParams.get("featured") === "true";
  const onlyPopular = searchParams.get("popular") === "true";
  const onlyPremium = searchParams.get("premiumOnly") === "true";
  const tree = searchParams.get("tree") === "true";

  const result = await listLocalizedCategories({
    locale,
    onlyActive: true,
    search,
    featured: onlyFeatured ? true : undefined,
    popular: onlyPopular ? true : undefined,
    premiumOnly: onlyPremium ? true : undefined,
  });

  const categories = tree ? buildCategoryTree(result.categories) : result.categories;

  return NextResponse.json(
    {
      locale: result.locale,
      categories,
    },
    { status: 200 }
  );
}
