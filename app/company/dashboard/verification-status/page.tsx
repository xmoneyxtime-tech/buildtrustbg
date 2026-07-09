"use client";

import { DashboardShell, StatusBadge } from "@/app/components/ui";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { useTranslation } from "@/app/lib/i18n";

export default function VerificationStatusPage() {
  const { t } = useTranslation();

  // Timeline steps showing the approval process
  const timelineSteps = [
    {
      label: t("verification.statusRegistered"),
      description: t("verification.registeredDescription"),
      completed: true,
      active: false,
    },
    {
      label: t("verification.statusPending"),
      description: t("verification.pendingDescription"),
      completed: false,
      active: true,
    },
    {
      label: t("verification.statusApproved"),
      description: t("verification.approvedDescription"),
      completed: false,
      active: false,
    },
  ];

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.verificationTitle")}
      subtitle={t("dashboardCompany.verificationDescription")}
    >
      <div className="space-y-6">
        {/* Current Status */}
        <div className="rounded-[24px] border border-[#F58220]/20 bg-[#FFF7EE]/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F58220]">
            {t("dashboardCompany.verificationTitle")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge variant="warning">{t("verification.statusRegistered")}</StatusBadge>
            <StatusBadge variant="info">{t("verification.statusPending")}</StatusBadge>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            {t("verification.pendingDescription")}
          </p>
        </div>

        {/* Approval Timeline */}
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-6">
          <h3 className="mb-6 text-base font-semibold text-slate-900">{t("verification.timelineTitle")}</h3>
          <div className="space-y-0">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      step.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : step.active
                          ? "border-[#F58220] bg-[#FFF7EE] text-[#F58220]"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {step.completed ? "✓" : idx + 1}
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`mt-1 w-0.5 flex-1 ${step.completed ? "bg-emerald-300" : "bg-slate-200"}`} style={{ minHeight: "2rem" }} />
                  )}
                </div>
                {/* Step content */}
                <div className="pb-6">
                  <p className={`font-semibold ${step.active ? "text-[#F58220]" : step.completed ? "text-emerald-700" : "text-slate-500"}`}>
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Verification CTA */}
        <GoldVerificationCard />
      </div>
    </DashboardShell>
  );
}
