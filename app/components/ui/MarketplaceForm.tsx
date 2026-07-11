"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/app/lib/i18n";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";
import { normalizeLocale } from "@/app/lib/categories/shared";

type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string | null;
};

const defaultForm: CompanyRegistrationForm = {
  companyName: "",
  email: "",
  phone: "",
  city: "",
  service: "",
  categoryIds: [],
  description: "",
  website: "",
};

type MarketplaceFormProps = {
  onSubmit: (form: CompanyRegistrationForm) => void;
  submitLabel?: string;
};

export function MarketplaceForm({ onSubmit, submitLabel }: MarketplaceFormProps) {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<CompanyRegistrationForm>(defaultForm);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

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
          throw new Error(body.error || "Unable to load categories");
        }

        const data = (await response.json()) as { categories: PublicCategory[] };
        setCategories(data.categories);
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : "Unable to load categories");
      }
    }

    void loadCategories();
  }, [language]);

  const categoryById = useMemo(() => {
    const map = new Map<string, PublicCategory>();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }, [categories]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedNames = form.categoryIds
      .map((id) => categoryById.get(id)?.name)
      .filter((name): name is string => Boolean(name));
    const payload: CompanyRegistrationForm = {
      ...form,
      service: selectedNames.join(", "),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.companyName")}</span>
          <input
            required
            value={form.companyName}
            onChange={(event) => setForm({ ...form, companyName: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder={t("auth.companyNamePlaceholder")}
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.email")}</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder={t("auth.emailPlaceholder")}
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.phone")}</span>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder={t("auth.phonePlaceholder")}
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.city")}</span>
          <input
            required
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder={t("auth.cityPlaceholder")}
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.service")}</span>
          <select
            required
            multiple
            value={form.categoryIds}
            onChange={(event) => {
              const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
              const selectedNames = selected
                .map((id) => categoryById.get(id)?.name)
                .filter((name): name is string => Boolean(name));

              setForm({
                ...form,
                categoryIds: selected,
                service: selectedNames.join(", "),
              });
            }}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
          >
            {categories
              .filter((category) => !category.parentId)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
          </select>
          {categoriesError && <p className="mt-1 text-xs text-red-600">{categoriesError}</p>}
          <p className="mt-1 text-xs text-slate-500">Задръж Ctrl/Cmd за избор на повече категории.</p>
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.website")}</span>
          <input
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="https://company.bg"
          />
        </label>
      </div>

      <label className="block text-sm text-slate-700">
        <span className="mb-2 block font-medium">{t("formLabels.description")}</span>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
          placeholder="Опишете услугите и специализацията на фирмата."
        />
      </label>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
      >
        {submitLabel || t("auth.submitApplication")}
      </button>
    </form>
  );
}
