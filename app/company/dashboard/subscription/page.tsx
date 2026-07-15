"use client";

import { DashboardShell } from "@/app/components/ui";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { FeaturedCompanyCard } from "@/app/components/ui/FeaturedCompanyCard";
import { PaymentMethods } from "@/app/components/ui/PaymentMethods";
import { useTranslation } from "@/app/lib/i18n";

export default function SubscriptionPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell role="company">
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="rounded-[24px] border border-emerald-200/80 bg-emerald-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("premiumFeatures.currentPlan")}</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{t("premiumFeatures.freePlan")}</h3>
              <p className="mt-1 text-sm text-slate-600">{t("premiumFeatures.freePlanDesc")}</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
              {t("status.active")}
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">{t("premiumFeatures.upgradeOptions")}</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <FeaturedCompanyCard />
            <PremiumCard />
            <GoldVerificationCard />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <PaymentMethods />

          <section
            aria-label="Billing information"
            className="rounded-[20px] border border-slate-200/80 bg-white p-5"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">Billing information</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>✓ Secure Checkout</li>
              <li>✓ Instant activation after successful payment</li>
              <li>✓ VAT invoice available</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
