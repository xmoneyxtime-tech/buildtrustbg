"use client";

import { useTranslation } from "@/app/lib/i18n";

export function FeaturedCompanyCard() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            Starter
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Starter</h3>
          <p className="mt-3 text-slate-700">
            <span className="text-3xl font-bold text-slate-900">€9.99</span>
            <span className="text-slate-600"> / month</span>
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">Starter</div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-[#F58220]/20 bg-[#FFF7EE] p-4 text-sm leading-7 text-slate-700">
        <p>
          ⭐ {t("featured.featuredDescription")}
        </p>
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-white px-6 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
        {t("featured.learnMore")}
      </button>
    </div>
  );
}
