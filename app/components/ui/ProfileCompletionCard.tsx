"use client";

import { useTranslation } from "@/app/lib/i18n";

type ProfileCompletionCardProps = {
  completionPercentage?: number;
};

export function ProfileCompletionCard({ completionPercentage = 0 }: ProfileCompletionCardProps) {
  const { t } = useTranslation();

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-[#F58220]";
    return "bg-emerald-500";
  };

  const getProgressTextColor = (percentage: number) => {
    if (percentage < 30) return "text-red-600";
    if (percentage < 70) return "text-[#F58220]";
    return "text-emerald-600";
  };

  const checklistItems = [
    { label: t("profileCompletion.logo"), completed: false },
    { label: t("profileCompletion.description"), completed: false },
    { label: t("profileCompletion.services"), completed: false },
    { label: t("profileCompletion.gallery"), completed: false },
    { label: t("profileCompletion.contactInfo"), completed: false },
    { label: t("profileCompletion.verification"), completed: false },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <h2 className="text-xl font-semibold text-slate-900">{t("profileCompletion.title")}</h2>

      <div className="mt-6 flex items-end gap-4">
        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{t("profileCompletion.progress")}</span>
            <span className={`text-xl font-bold ${getProgressTextColor(completionPercentage)}`}>
              {completionPercentage}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-500 ease-out ${getProgressColor(completionPercentage)}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm font-semibold text-slate-900">{t("profileCompletion.missingItems")}:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white">
                {item.completed ? <span className="text-green-600">✓</span> : <span className="text-slate-300">◻</span>}
              </div>
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
