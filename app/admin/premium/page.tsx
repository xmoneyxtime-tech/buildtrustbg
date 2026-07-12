"use client";

import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminBadge } from "@/app/components/ui/AdminBadge";
import { AdminNotice } from "@/app/components/ui/AdminNotice";
import { mockCompanies } from "@/app/lib/mock-admin-data";
import { sortByLocale } from "@/app/lib/sorting";

export default function PremiumCompaniesPage() {
  const premiumCompanies = sortByLocale(
    mockCompanies.filter((c) => c.verification === "premium"),
    "bg",
    (company) => company.name
  );

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <AdminNotice />
        {premiumCompanies.length > 0 ? (
          <AdminTable
            columns={[
              { key: "name", label: "Фирма" },
              { key: "email", label: "Email" },
              { key: "city", label: "Град" },
              { key: "service", label: "Услуга" },
              {
                key: "status",
                label: "Статус",
                render: (status) => (
                  <AdminBadge
                    variant={status as "pending" | "approved" | "rejected"}
                    label={
                      status === "pending"
                        ? "Очаква се"
                        : status === "approved"
                          ? "Одобрена"
                          : "Отхвърлена"
                    }
                  />
                ),
              },
              { key: "submittedAt", label: "Дата" },
            ]}
            data={premiumCompanies}
            actions={[
              { label: "Преглед", onClick: () => {}, variant: "secondary" },
              { label: "Отмени", onClick: () => {}, variant: "danger" },
            ]}
          />
        ) : (
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
            <p className="text-slate-600">Няма Premium фирми.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
