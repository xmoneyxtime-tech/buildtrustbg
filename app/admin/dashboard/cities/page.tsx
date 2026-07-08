"use client";

import { useState } from "react";
import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminForm } from "@/app/components/ui/AdminForm";
import { mockCities } from "@/app/lib/mock-admin-data";

export default function CitiesPage() {
  const [cities, setCities] = useState(mockCities);
  const [showForm, setShowForm] = useState(false);

  const handleAddCity = (data: Record<string, string>) => {
    const newCity = {
      id: String(Math.max(...cities.map((c) => parseInt(c.id)), 0) + 1),
      name: data.name,
      region: data.region,
    };
    setCities([...cities, newCity]);
    setShowForm(false);
  };

  const handleDeleteCity = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
  };

  return (
    <DashboardShell role="admin" title="Градове" subtitle="Управляйте градове и региони">
      <div className="space-y-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
        >
          {showForm ? "Отмени" : "Добави град"}
        </button>

        {showForm && (
          <AdminForm
            fields={[
              { name: "name", label: "Град", type: "text", required: true, placeholder: "София" },
              { name: "region", label: "Регион", type: "text", required: true, placeholder: "Столична" },
            ]}
            onSubmit={handleAddCity}
            submitLabel="Добави"
            onCancel={() => setShowForm(false)}
          />
        )}

        <AdminTable
          columns={[
            { key: "name", label: "Град" },
            { key: "region", label: "Регион" },
          ]}
          data={cities}
          actions={[
            { label: "Редактирай", onClick: () => {}, variant: "secondary" },
            { label: "Изтрий", onClick: (row) => handleDeleteCity(row.id), variant: "danger" },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
