"use client";

import { useTranslation } from "@/app/lib/i18n";

interface AIInsight {
  icon: string;
  text: string;
}

export function AIInsightsCard() {
  const { t } = useTranslation();

  const insights: AIInsight[] = [
    {
      icon: "📷",
      text: t("dashboardCompany.aiInsightUploadPhotos"),
    },
    {
      icon: "🛡️",
      text: t("dashboardCompany.aiInsightVerified"),
    },
    {
      icon: "✍️",
      text: t("dashboardCompany.aiInsightDescription300"),
    },
  ];

  return (
    <div className="rounded-[24px] border border-[#F58220]/20 bg-gradient-to-br from-[#FFF7EE] to-white p-6 shadow-[0_12px_32px_-16px_rgba(245,130,32,0.12)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">💡</span>
        <h3 className="text-base font-semibold text-slate-900">{t("dashboardCompany.aiInsightTitle")}</h3>
      </div>
      <p className="mb-4 text-sm text-slate-700">{t("dashboardCompany.aiInsightDescription")}</p>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="flex gap-3 rounded-2xl border border-[#F58220]/10 bg-white p-3 transition hover:border-[#F58220]/30 hover:bg-[#FFF7EE]/50"
          >
            <span className="text-lg">{insight.icon}</span>
            <p className="text-sm leading-6 text-slate-700">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
