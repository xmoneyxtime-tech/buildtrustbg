"use client";

import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminNotice } from "@/app/components/ui/AdminNotice";
import { mockCompanies } from "@/app/lib/mock-admin-data";
import { sortByLocale } from "@/app/lib/sorting";

export default function PendingCompaniesPage() {
  const pendingCompanies = sortByLocale(
    mockCompanies.filter((c) => c.status === "pending"),
    "bg",
    (company) => company.name
  );

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <AdminNotice />
        {pendingCompanies.length > 0 ? (
          <AdminTable
            columns={[
              { key: "name", label: "Фирма" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Телефон" },
              { key: "city", label: "Град" },
              { key: "service", label: "Услуга" },
              { key: "submittedAt", label: "Подадена" },
            ]}
            data={pendingCompanies}
            actions={[
              { label: "Преглед", onClick: () => {}, variant: "secondary" },
              { label: "Одобри", onClick: () => {}, variant: "primary" },
              { label: "Отхвърли", onClick: () => {}, variant: "danger" },
            ]}
          />
        ) : (
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
            <p className="text-slate-600">Няма чакащи одобрение компании.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
