"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";

type CategoryTranslation = {
  locale: string;
  name: string;
  description: string;
  seoSlug: string;
  metaTitle: string;
  metaDescription: string;
};

type AdminCategory = {
  id: string;
  slug: string;
  icon: string;
  image: string | null;
  featured: boolean;
  popular: boolean;
  premiumOnly: boolean;
  searchKeywords: string[];
  synonyms: string[];
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  parent?: {
    id: string;
    slug: string;
    translations?: Array<{ locale: string; name: string }>;
  } | null;
  translations: CategoryTranslation[];
};

type CategoryFormState = {
  slug: string;
  icon: string;
  image: string;
  parentId: string;
  sortOrder: string;
  isActive: boolean;
  featured: boolean;
  popular: boolean;
  premiumOnly: boolean;
  searchKeywords: string;
  synonyms: string;
  bgName: string;
  bgDescription: string;
  bgSeoSlug: string;
  bgMetaTitle: string;
  bgMetaDescription: string;
  enName: string;
  enDescription: string;
  enSeoSlug: string;
  enMetaTitle: string;
  enMetaDescription: string;
};

const initialFormState: CategoryFormState = {
  slug: "",
  icon: "🏷️",
  image: "",
  parentId: "",
  sortOrder: "0",
  isActive: true,
  featured: false,
  popular: false,
  premiumOnly: false,
  searchKeywords: "",
  synonyms: "",
  bgName: "",
  bgDescription: "",
  bgSeoSlug: "",
  bgMetaTitle: "",
  bgMetaDescription: "",
  enName: "",
  enDescription: "",
  enSeoSlug: "",
  enMetaTitle: "",
  enMetaDescription: "",
};

function translationFor(category: AdminCategory, locale: string): CategoryTranslation | null {
  return category.translations.find((item) => item.locale === locale) || null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CategoryFormState>(initialFormState);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const parentOptions = useMemo(
    () => categories.filter((category) => category.id !== editingCategoryId),
    [categories, editingCategoryId]
  );

  async function loadCategories(query = search) {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("locale", "bg");
      if (query.trim()) {
        params.set("search", query.trim());
      }

      const response = await fetch(`/api/admin/categories?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешно зареждане на категории");
      }

      const data = (await response.json()) as { categories: AdminCategory[] };
      setCategories(data.categories);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Неуспешно зареждане на категории");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  function resetFormState() {
    setFormData(initialFormState);
    setEditingCategoryId(null);
    setShowForm(false);
  }

  function startCreate() {
    setEditingCategoryId(null);
    setFormData(initialFormState);
    setShowForm(true);
    setError(null);
  }

  function startEdit(category: AdminCategory) {
    const bg = translationFor(category, "bg");
    const en = translationFor(category, "en");

    setEditingCategoryId(category.id);
    setFormData({
      slug: category.slug,
      icon: category.icon,
      image: category.image || "",
      parentId: category.parentId || "",
      sortOrder: String(category.sortOrder),
      isActive: category.isActive,
      featured: category.featured,
      popular: category.popular,
      premiumOnly: category.premiumOnly,
      searchKeywords: category.searchKeywords.join(", "),
      synonyms: category.synonyms.join(", "),
      bgName: bg?.name || "",
      bgDescription: bg?.description || "",
      bgSeoSlug: bg?.seoSlug || "",
      bgMetaTitle: bg?.metaTitle || "",
      bgMetaDescription: bg?.metaDescription || "",
      enName: en?.name || "",
      enDescription: en?.description || "",
      enSeoSlug: en?.seoSlug || "",
      enMetaTitle: en?.metaTitle || "",
      enMetaDescription: en?.metaDescription || "",
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        slug: formData.slug,
        icon: formData.icon,
        image: formData.image || null,
        parentId: formData.parentId || null,
        sortOrder: Number(formData.sortOrder || 0),
        isActive: formData.isActive,
        featured: formData.featured,
        popular: formData.popular,
        premiumOnly: formData.premiumOnly,
        searchKeywords: formData.searchKeywords,
        synonyms: formData.synonyms,
        translations: [
          {
            locale: "bg",
            name: formData.bgName,
            description: formData.bgDescription,
            seoSlug: formData.bgSeoSlug,
            metaTitle: formData.bgMetaTitle,
            metaDescription: formData.bgMetaDescription,
          },
          {
            locale: "en",
            name: formData.enName,
            description: formData.enDescription,
            seoSlug: formData.enSeoSlug,
            metaTitle: formData.enMetaTitle,
            metaDescription: formData.enMetaDescription,
          },
        ],
      };

      const endpoint = editingCategoryId
        ? `/api/admin/categories/${editingCategoryId}`
        : "/api/admin/categories";
      const method = editingCategoryId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешно записване на категория");
      }

      resetFormState();
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Неуспешно записване на категория");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    const confirmed = window.confirm("Сигурни ли сте, че искате да изтриете тази категория?");
    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешно изтриване на категория");
      }

      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Неуспешно изтриване на категория");
    }
  }

  const formTitle = editingCategoryId ? "Редакция на категория" : "Нова категория";

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startCreate}
            className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
          >
            Добави категория
          </button>
          <div className="flex min-w-[280px] grow gap-2">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Търси по slug, име, описание, keywords"
              className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            />
            <button
              onClick={() => {
                void loadCategories(search);
              }}
              className="rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Търси
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]"
          >
            <h2 className="text-lg font-semibold text-slate-900">{formTitle}</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-900">Slug</span>
                <input
                  required
                  value={formData.slug}
                  onChange={(event) => setFormData((prev) => ({ ...prev, slug: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-900">Икона</span>
                <input
                  required
                  value={formData.icon}
                  onChange={(event) => setFormData((prev) => ({ ...prev, icon: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-900">Image URL</span>
                <input
                  value={formData.image}
                  onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-900">Parent категория</span>
                <select
                  value={formData.parentId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, parentId: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                >
                  <option value="">Няма parent</option>
                  {parentOptions.map((category) => {
                    const bg = translationFor(category, "bg");
                    return (
                      <option key={category.id} value={category.id}>
                        {bg?.name || category.slug}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-semibold text-slate-900">Sort order</span>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-semibold text-slate-900">Search keywords (comma separated)</span>
                <input
                  value={formData.searchKeywords}
                  onChange={(event) => setFormData((prev) => ({ ...prev, searchKeywords: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-semibold text-slate-900">Synonyms (comma separated)</span>
                <input
                  value={formData.synonyms}
                  onChange={(event) => setFormData((prev) => ({ ...prev, synonyms: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <div className="flex flex-wrap gap-4 pt-6 text-sm font-semibold text-slate-900">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) => setFormData((prev) => ({ ...prev, isActive: event.target.checked }))}
                  />
                  Активна
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.checked }))}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(event) => setFormData((prev) => ({ ...prev, popular: event.target.checked }))}
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.premiumOnly}
                    onChange={(event) => setFormData((prev) => ({ ...prev, premiumOnly: event.target.checked }))}
                  />
                  Premium only
                </label>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">Bulgarian (BG)</h3>
                <input
                  required
                  placeholder="Име"
                  value={formData.bgName}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bgName: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <textarea
                  required
                  placeholder="Описание"
                  rows={3}
                  value={formData.bgDescription}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bgDescription: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <input
                  required
                  placeholder="SEO slug"
                  value={formData.bgSeoSlug}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bgSeoSlug: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <input
                  required
                  placeholder="Meta title"
                  value={formData.bgMetaTitle}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bgMetaTitle: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <textarea
                  required
                  placeholder="Meta description"
                  rows={2}
                  value={formData.bgMetaDescription}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bgMetaDescription: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">English (EN)</h3>
                <input
                  required
                  placeholder="Name"
                  value={formData.enName}
                  onChange={(event) => setFormData((prev) => ({ ...prev, enName: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <textarea
                  required
                  placeholder="Description"
                  rows={3}
                  value={formData.enDescription}
                  onChange={(event) => setFormData((prev) => ({ ...prev, enDescription: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <input
                  required
                  placeholder="SEO slug"
                  value={formData.enSeoSlug}
                  onChange={(event) => setFormData((prev) => ({ ...prev, enSeoSlug: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <input
                  required
                  placeholder="Meta title"
                  value={formData.enMetaTitle}
                  onChange={(event) => setFormData((prev) => ({ ...prev, enMetaTitle: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
                <textarea
                  required
                  placeholder="Meta description"
                  rows={2}
                  value={formData.enMetaDescription}
                  onChange={(event) => setFormData((prev) => ({ ...prev, enMetaDescription: event.target.value }))}
                  className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Запис..." : editingCategoryId ? "Запази" : "Създай"}
              </button>
              <button
                type="button"
                onClick={resetFormState}
                className="rounded-[12px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Отмени
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">Зареждане на категории...</div>
        ) : (
          <AdminTable
            columns={[
              { key: "icon", label: "Икона" },
              {
                key: "slug",
                label: "Име (BG)",
                render: (_value, row) => translationFor(row, "bg")?.name || row.slug,
              },
              { key: "slug", label: "Slug" },
              {
                key: "parentId",
                label: "Parent",
                render: (_value, row) => {
                  const name = row.parent?.translations?.find((item) => item.locale === "bg")?.name;
                  return name || row.parent?.slug || "-";
                },
              },
              { key: "sortOrder", label: "Ред" },
              {
                key: "isActive",
                label: "Статус",
                render: (value, row) => {
                  const flags = [
                    value ? "Активна" : "Неактивна",
                    row.featured ? "Featured" : null,
                    row.popular ? "Popular" : null,
                    row.premiumOnly ? "Premium" : null,
                  ].filter(Boolean);
                  return flags.join(" • ");
                },
              },
            ]}
            data={categories}
            actions={[
              { label: "Редактирай", onClick: (row) => startEdit(row), variant: "secondary" },
              {
                label: "Изтрий",
                onClick: (row) => {
                  void handleDeleteCategory(row.id);
                },
                variant: "danger",
              },
            ]}
          />
        )}
      </div>
    </DashboardShell>
  );
}
