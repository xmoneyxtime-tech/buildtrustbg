"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell, MarketplaceForm, Panel } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: CompanyRegistrationForm) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch("/api/company/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        throw new Error(body.message || "Application submission failed");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Application submission failed");
    } finally {
      setSubmitting(false);
    }
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

            {submitError ? (
              <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <MarketplaceForm
              onSubmit={(form) => {
                void handleSubmit(form);
              }}
              submitLabel={submitting ? "Submitting..." : t("auth.submitApplication")}
            />

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
