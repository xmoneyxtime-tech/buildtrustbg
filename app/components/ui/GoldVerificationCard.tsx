"use client";

import { useTranslation } from "@/app/lib/i18n";
import { SubscriptionActionButton } from "@/app/company/dashboard/subscription/SubscriptionActionButton";

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
            Gold
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Gold</h3>
          <div className="mt-3 space-y-2 text-slate-700">
            <p>
              <span className="text-3xl font-bold text-slate-900">€99.99</span>
              <span className="text-slate-600"> / month</span>
            </p>
            <div className="flex items-center gap-2">
              <p>
                <span className="text-xl font-semibold text-slate-900">€999</span>
                <span className="text-slate-600"> / year</span>
              </p>
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Save €200
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-full border border-[#0F4C81]/25 bg-[#F0F4F9] px-3 py-1 text-sm font-semibold text-[#0F4C81]">Gold</div>
      </div>

      <div className="mt-6 space-y-2">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="text-[#0F4C81]">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <SubscriptionActionButton
          endpoint="/api/company/subscription/checkout"
          payload={{ planCode: "gold", billingInterval: "monthly" }}
          label={`${t("verification.applyNow")} Monthly`}
          variant="primary"
        />
        <SubscriptionActionButton
          endpoint="/api/company/subscription/checkout"
          payload={{ planCode: "gold", billingInterval: "yearly" }}
          label="Choose Yearly"
          variant="secondary"
        />
      </div>
    </div>
  );
}
