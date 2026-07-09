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
    { label: t("profileCompletion.coverImage"), completed: false },
    { label: t("profileCompletion.description"), completed: false },
    { label: t("profileCompletion.services"), completed: false },
    { label: t("profileCompletion.gallery"), completed: false },
    { label: t("profileCompletion.projects"), completed: false },
    { label: t("profileCompletion.contactInfo"), completed: false },
    { label: t("profileCompletion.workingHours"), completed: false },
    { label: t("profileCompletion.verification"), completed: false },
    { label: t("profileCompletion.socialLinks"), completed: false },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{t("profileCompletion.title")}</h2>
        <span className={`text-2xl font-bold ${getProgressTextColor(completionPercentage)}`}>
          {completionPercentage}%
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">{t("profileCompletion.progress")}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full transition-all duration-500 ease-out ${getProgressColor(completionPercentage)}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm font-semibold text-slate-900">{t("profileCompletion.missingItems")}:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                item.completed
                  ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 ${
                  item.completed
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {item.completed && (
                  <span className="text-xs font-bold text-white">✓</span>
                )}
              </div>
              <span
                className={`flex-1 text-sm font-medium ${
                  item.completed ? "text-emerald-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
