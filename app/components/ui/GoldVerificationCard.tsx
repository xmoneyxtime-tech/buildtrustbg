"use client";

import { useTranslation } from "@/app/lib/i18n";

export function GoldVerificationCard() {
  const { t } = useTranslation();

  const benefits = [
    t("verification.verifiedBadge"),
    t("verification.enhancedTrust"),
    t("verification.searchPriority"),
    t("verification.clientVisibility"),
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#0F4C81]/25 bg-[#F0F4F9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">
            {t("verification.goldBadge")}
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">{t("verification.goldTitle")}</h3>
          <p className="mt-3 text-slate-700">
            <span className="text-3xl font-bold text-slate-900">{t("verification.goldPrice")} €</span>
            <span className="text-slate-600"> / {t("verification.goldPriceUnit")}</span>
          </p>
        </div>
        <div className="text-4xl">🛡️</div>
      </div>

      <div className="mt-6 space-y-2">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="text-[#0F4C81]">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
        {t("verification.applyNow")}
      </button>
    </div>
  );
}
