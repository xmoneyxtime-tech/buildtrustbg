"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell, MarketplaceForm, Panel } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (form: CompanyRegistrationForm) => {
    console.info("Company registration submitted", form);
    setSubmitted(true);
  };

  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title={t("auth.registerTitle")} description={t("auth.registerDescription")} className="w-full max-w-3xl">
          <div className="space-y-5">
            <div className="rounded-[20px] border border-[#F58220]/20 bg-[#FFF7EE] p-4 text-sm leading-7 text-slate-700">
              {t("auth.applicationNotice")}
            </div>

            {submitted ? (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {t("auth.applicationSuccess")}
              </div>
            ) : null}

            <MarketplaceForm onSubmit={handleSubmit} submitLabel={t("auth.submitApplication")} />

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/company/dashboard" className="rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
                {t("auth.companyDashboard")}
              </Link>
              <Link href="/admin/dashboard" className="rounded-full border border-[#0F4C81]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
                {t("auth.adminDashboard")}
              </Link>
            </div>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
