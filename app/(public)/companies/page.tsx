"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, Panel } from "@/app/components/ui";
import { getLocalizedCities } from "@/app/lib/localized-data";
import { useTranslation } from "@/app/lib/i18n";
import { normalizeLocale } from "@/app/lib/categories/shared";
import { sortByLocale } from "@/app/lib/sorting";

type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  parentId: string | null;
  translations?: Array<{
    locale: string;
    name: string;
  }>;
};

export default function CompaniesPage() {
  const { t, language } = useTranslation();
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const cities = getLocalizedCities(language);

  const getLocalizedCategoryName = (category: PublicCategory) => {
    if (language !== "en") {
      return category.name;
    }

    const english = category.translations?.find((item) => item.locale === "en")?.name;
    return english || category.name;
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesError(null);

        const locale = normalizeLocale(language);

        const response = await fetch(`/api/categories?locale=${encodeURIComponent(locale)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error || "Failed to load categories");
        }

        const data = (await response.json()) as { categories: PublicCategory[] };
        setCategories(sortByLocale(data.categories, locale, (category) => category.name));
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : "Failed to load categories");
      }
    }

    void loadCategories();
  }, [language]);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.2)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">{t("companiesPage.badge")}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t("companiesPage.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            {t("companiesPage.description")}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title={t("companiesPage.categoriesTitle")} description={t("companiesPage.categoriesDescription")}>
              {categoriesError ? (
                <p className="text-sm text-red-600">{categoriesError}</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <span key={category.id} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                      {getLocalizedCategoryName(category)}
                    </span>
                  ))}
                </div>
              )}
            </Panel>
            <Panel title={t("companiesPage.citiesTitle")} description={t("companiesPage.citiesDescription")}>
              <div className="flex flex-wrap gap-3">
                {cities.map((city) => (
                  <span key={city} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-8 rounded-[24px] border border-dashed border-slate-300 bg-[#F8FAFC] p-8 text-center text-slate-600">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">{t("companiesPage.catalogBadge")}</p>
            <p className="mt-3 text-base leading-7">{t("companiesPage.catalogDescription")}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register" className="rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
                {t("companiesPage.registerButton")}
              </Link>
              <Link href="/login" className="rounded-full border border-[#0F4C81]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
                {t("companiesPage.loginButton")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
