"use client";

import { useTranslation } from "@/app/lib/i18n";

export function PremiumCard() {
  const { t } = useTranslation();

  const benefits = [
    t("premiumFeatures.priorityRanking"),
    t("premiumFeatures.unlimitedGallery"),
    t("premiumFeatures.featuredProfile"),
    t("premiumFeatures.statsAnalytics"),
    t("premiumFeatures.expansionSupport"),
  ];

  return (
    <div className="rounded-[28px] border border-[#F58220]/20 bg-gradient-to-br from-[#FFF7EE] to-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#F58220]/30 bg-[#FFE8D0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            {t("premiumFeatures.premiumBadge")}
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">{t("premiumFeatures.premiumTitle")}</h3>
          <p className="mt-3 text-slate-700">
            <span className="text-3xl font-bold text-slate-900">{t("premiumFeatures.premiumPrice")} €</span>
            <span className="text-slate-600"> / {t("premiumFeatures.premiumPriceUnit").split(" / ")[1]}</span>
          </p>
        </div>
        <div className="text-4xl">💎</div>
      </div>

      <div className="mt-6 space-y-2">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="text-[#F58220]">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#F58220] px-6 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
        {t("premiumFeatures.becomePremium")}
      </button>
    </div>
  );
}
