"use client";

import { useState } from "react";
import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminForm } from "@/app/components/ui/AdminForm";
import { mockCategories } from "@/app/lib/mock-admin-data";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showForm, setShowForm] = useState(false);

  const handleAddCategory = (data: Record<string, string>) => {
    const newCategory = {
      id: String(Math.max(...categories.map((c) => parseInt(c.id)), 0) + 1),
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      description: data.description,
    };
    setCategories([...categories, newCategory]);
    setShowForm(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
        >
          {showForm ? "Отмени" : "Добави категория"}
        </button>

        {showForm && (
          <AdminForm
            fields={[
              { name: "name", label: "Име на категория", type: "text", required: true, placeholder: "Бетонни работи" },
              { name: "slug", label: "URL slug", type: "text", required: true, placeholder: "beton" },
              { name: "icon", label: "Икона (Emoji)", type: "text", required: true, placeholder: "🏗️" },
              { name: "description", label: "Описание", type: "textarea", required: true, placeholder: "Описание на категорията" },
            ]}
            onSubmit={handleAddCategory}
            submitLabel="Добави"
            onCancel={() => setShowForm(false)}
          />
        )}

        <AdminTable
          columns={[
            { key: "icon", label: "Икона" },
            { key: "name", label: "Име" },
            { key: "slug", label: "Slug" },
            { key: "description", label: "Описание" },
          ]}
          data={categories}
          actions={[
            { label: "Редактирай", onClick: () => {}, variant: "secondary" },
            { label: "Изтрий", onClick: (row) => handleDeleteCategory(row.id), variant: "danger" },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
