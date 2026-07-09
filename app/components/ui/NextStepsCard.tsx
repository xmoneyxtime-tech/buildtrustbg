"use client";

import { useTranslation } from "@/app/lib/i18n";
import Link from "next/link";

interface NextStep {
  icon: string;
  label: string;
  description: string;
  href: string;
  priority: "high" | "medium" | "low";
}

interface NextStepsCardProps {
  steps: NextStep[];
}

export function NextStepsCard({ steps }: NextStepsCardProps) {
  const { t } = useTranslation();

  const highPriority = steps.filter((s) => s.priority === "high");
  const mediumPriority = steps.filter((s) => s.priority === "medium");

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <h2 className="text-xl font-semibold text-slate-900">{t("nextSteps.title")}</h2>

      {highPriority.length > 0 && (
        <div className="mt-6">
          <p className="mb-4 text-sm font-semibold text-slate-700">{t("nextSteps.priorityActions")}</p>
          <div className="space-y-3">
            {highPriority.map((step, idx) => (
              <Link
                key={idx}
                href={step.href}
                className="flex items-start gap-4 rounded-2xl border border-[#F58220]/20 bg-[#FFF7EE] p-4 transition hover:border-[#F58220]/40 hover:bg-[#FFE8D0]"
              >
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{step.label}</p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
                <span className="text-[#F58220]">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold text-slate-700">{t("nextSteps.otherActions")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {mediumPriority.map((step, idx) => (
              <Link
                key={idx}
                href={step.href}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-[#0F4C81]/20 hover:bg-[#F0F4F9]"
              >
                <span className="text-xl">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{step.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
