"use client";

import { DashboardShell } from "@/app/components/ui";
import { AdminCard } from "@/app/components/ui/AdminCard";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminBadge } from "@/app/components/ui/AdminBadge";
import { mockCompanies } from "@/app/lib/mock-admin-data";

export default function AdminDashboardPage() {
  const totalCompanies = mockCompanies.length;
  const approvedCompanies = mockCompanies.filter((c) => c.status === "approved").length;
  const pendingCompanies = mockCompanies.filter((c) => c.status === "pending").length;
  const goldCompanies = mockCompanies.filter((c) => c.verification === "gold").length;
  const premiumCompanies = mockCompanies.filter((c) => c.verification === "premium").length;

  const latestRegistrations = mockCompanies.slice(-3).reverse();
  const pendingApprovals = mockCompanies.filter((c) => c.status === "pending");

  return (
    <DashboardShell
      role="admin"
      title="Dashboard"
      subtitle="Преглед на платформата BuildTrustBG"
    >
      <div className="space-y-8">
        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <AdminCard title="Всички фирми" value={totalCompanies} icon="🏢" color="blue" />
          <AdminCard
            title="Одобрени"
            value={approvedCompanies}
            icon="✅"
            color="green"
          />
          <AdminCard
            title="Очаква се"
            value={pendingCompanies}
            icon="⏳"
            color="orange"
          />
          <AdminCard title="Gold" value={goldCompanies} icon="🛡️" color="blue" />
          <AdminCard
            title="Premium"
            value={premiumCompanies}
            icon="💎"
            color="blue"
          />
        </div>

        {/* Latest Registrations */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Последни регистрации</h2>
          <AdminTable
            columns={[
              { key: "name", label: "Фирма" },
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
            data={latestRegistrations}
          />
        </div>

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Очаква се одобрение</h2>
            <AdminTable
              columns={[
                { key: "name", label: "Фирма" },
                { key: "email", label: "Email" },
                { key: "city", label: "Град" },
                { key: "phone", label: "Телефон" },
              ]}
              data={pendingApprovals}
              actions={[
                { label: "Одобри", onClick: () => {}, variant: "primary" },
                { label: "Отхвърли", onClick: () => {}, variant: "danger" },
              ]}
            />
          </div>
        )}

        {/* Gold & Premium Companies */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Gold фирми</h2>
            <div className="space-y-3">
              {mockCompanies
                .filter((c) => c.verification === "gold")
                .map((company) => (
                  <div
                    key={company.id}
                    className="rounded-[16px] border border-yellow-200/80 bg-yellow-50/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{company.name}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {company.city} • {company.service}
                        </p>
                      </div>
                      <AdminBadge variant="gold" label="Gold" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Premium фирми</h2>
            <div className="space-y-3">
              {mockCompanies
                .filter((c) => c.verification === "premium")
                .map((company) => (
                  <div
                    key={company.id}
                    className="rounded-[16px] border border-purple-200/80 bg-purple-50/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{company.name}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {company.city} • {company.service}
                        </p>
                      </div>
                      <AdminBadge variant="premium" label="Premium" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
