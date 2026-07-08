"use client";

import { DashboardShell } from "@/app/components/ui";
import { AdminTable } from "@/app/components/ui/AdminTable";
import { AdminBadge } from "@/app/components/ui/AdminBadge";
import { mockCompanies } from "@/app/lib/mock-admin-data";

export default function AdminCompaniesPage() {
  return (
    <DashboardShell
      role="admin"
      title="Компании"
      subtitle="Управляйте всички регистрирани фирми на платформата"
    >
      <div className="space-y-6">
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
            {
              key: "verification",
              label: "Верификация",
              render: (verification) => (
                <AdminBadge
                  variant={
                    verification === "none"
                      ? "none"
                      : (verification as "gold" | "featured" | "premium")
                  }
                  label={
                    verification === "gold"
                      ? "Gold"
                      : verification === "featured"
                        ? "Featured"
                        : verification === "premium"
                          ? "Premium"
                          : "Нито една"
                  }
                />
              ),
            },
          ]}
          data={mockCompanies}
          actions={[
            { label: "Преглед", onClick: () => {}, variant: "secondary" },
            { label: "Редактирай", onClick: () => {}, variant: "secondary" },
            { label: "Одобри", onClick: () => {}, variant: "primary" },
            { label: "Gold", onClick: () => {}, variant: "secondary" },
            { label: "Featured", onClick: () => {}, variant: "secondary" },
            { label: "Premium", onClick: () => {}, variant: "secondary" },
            { label: "Изтрий", onClick: () => {}, variant: "danger" },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
