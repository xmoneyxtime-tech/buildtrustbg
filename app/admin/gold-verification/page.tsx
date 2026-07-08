"use client";

import { DashboardShell } from "@/app/components/ui";
import { ApplicationCard } from "@/app/components/ui/ApplicationCard";
import { AdminNotice } from "@/app/components/ui/AdminNotice";
import { mockGoldApplications } from "@/app/lib/mock-admin-data";

export default function GoldVerificationPage() {
  return (
    <DashboardShell
      role="admin"
      title="Gold Верификация"
      subtitle="Управляйте заявки за Gold верификация"
    >
      <div className="space-y-6">
        <AdminNotice />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockGoldApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              title={app.companyName}
              subtitle={app.email}
              details={[
                { label: "Email", value: app.email },
                { label: "Град", value: app.city },
                { label: "Подадена", value: app.appliedAt },
              ]}
              onApprove={() => {}}
              onReject={() => {}}
              status={app.status as "pending" | "approved" | "rejected"}
            />
          ))}
        </div>

        {mockGoldApplications.length === 0 && (
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
            <p className="text-slate-600">Няма заявки за Gold верификация.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
