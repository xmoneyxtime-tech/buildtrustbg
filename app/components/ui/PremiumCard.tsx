"use client";

import { useTranslation } from "@/app/lib/i18n";
import { SubscriptionActionButton } from "@/app/company/dashboard/subscription/SubscriptionActionButton";

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
            Premium
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Premium</h3>
          <div className="mt-3 space-y-2 text-slate-700">
            <p>
              <span className="text-3xl font-bold text-slate-900">€49.99</span>
              <span className="text-slate-600"> / month</span>
            </p>
            <div className="flex items-center gap-2">
              <p>
                <span className="text-xl font-semibold text-slate-900">€499</span>
                <span className="text-slate-600"> / year</span>
              </p>
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Save €100
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-full border border-[#F58220]/30 bg-[#FFE8D0] px-3 py-1 text-sm font-semibold text-[#F58220]">Premium</div>
      </div>

      <div className="mt-6 space-y-2">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="text-[#F58220]">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <SubscriptionActionButton
          endpoint="/api/company/subscription/checkout"
          payload={{ planCode: "premium", billingInterval: "monthly" }}
          label={`${t("premiumFeatures.becomePremium")} Monthly`}
          variant="primary"
          className="bg-[#F58220] hover:bg-[#E36F00]"
        />
        <SubscriptionActionButton
          endpoint="/api/company/subscription/checkout"
          payload={{ planCode: "premium", billingInterval: "yearly" }}
          label="Choose Yearly"
          variant="secondary"
        />
      </div>
    </div>
  );
}
