"use client";

import { useTranslation } from "@/app/lib/i18n";
import { StatusBadge } from "./StatusBadge";

interface PremiumHeroProps {
  companyName?: string;
  trustScore?: number;
  isVerified?: boolean;
  isPremium?: boolean;
}

export function PremiumHero({
  companyName = "Your Company",
  trustScore = 0,
  isVerified = false,
  isPremium = false,
}: PremiumHeroProps) {
  const { t } = useTranslation();

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-[#F58220]";
    return "text-red-600";
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return t("dashboardCompany.trustScoreExcellent");
    if (score >= 60) return t("dashboardCompany.trustScoreVeryGood");
    if (score >= 40) return t("dashboardCompany.trustScoreGood");
    return t("dashboardCompany.trustScoreNeedsImprovement");
  };

  return (
    <div className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-[#F8FAFC] to-[#F0F4F9] p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)] sm:p-10 lg:p-12">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left: Company Info with Avatar */}
        <div className="flex flex-1 items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="h-20 w-20 shrink-0 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-[#0F4C81]/10 to-[#F58220]/10 flex items-center justify-center text-4xl font-bold text-[#0F4C81]">
            {companyName.charAt(0).toUpperCase()}
          </div>

          {/* Company Info */}
          <div className="flex-1">
            {/* Badges */}
            <div className="mb-3 flex flex-wrap gap-2">
              {isVerified && <StatusBadge variant="success">{t("verification.statusApproved")}</StatusBadge>}
              {isPremium && <StatusBadge variant="warning">{t("premiumFeatures.premiumBadge")}</StatusBadge>}
            </div>

            {/* Company Name & Welcome */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{companyName}</h1>
            <p className="mt-2 text-base font-medium text-slate-700">
              {t("dashboardCompany.heroWelcome")}
            </p>
            <p className="mt-1 text-sm text-slate-500">{t("dashboardCompany.heroSubtitle")}</p>
          </div>
        </div>

        {/* Right: Trust Score Card */}
        <div className="w-full shrink-0 lg:w-96">
          <div className="flex flex-col items-center rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <p className={`text-6xl font-bold ${getTrustScoreColor(trustScore)}`}>
              {trustScore}
            </p>
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-600">
              {t("dashboardCompany.kpiTrustScore")}
            </p>
            <p className={`mt-3 rounded-full px-4 py-2 text-sm font-semibold ${
              trustScore >= 80 ? "bg-emerald-100 text-emerald-700" :
              trustScore >= 60 ? "bg-blue-100 text-blue-700" :
              trustScore >= 40 ? "bg-orange-100 text-orange-700" :
              "bg-red-100 text-red-700"
            }`}>
              {getTrustScoreLabel(trustScore)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
