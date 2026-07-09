"use client";

import Link from "next/link";
import { AppShell } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";

export default function AccessDeniedPage() {
  const { t } = useTranslation();

  return (
    <AppShell>
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="text-center">
          <div className="mb-6 text-6xl font-bold text-slate-900">403</div>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            {t("accessControl.accessDeniedTitle")}
          </h1>
          <p className="mb-8 max-w-xl text-lg text-slate-600">
            {t("accessControl.accessDeniedDescription")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
            >
              {t("accessControl.goHome")}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-[12px] border-2 border-[#0F4C81] bg-white px-6 text-sm font-semibold text-[#0F4C81] transition hover:bg-slate-50"
            >
              {t("buttons.login")}
            </Link>
          </div>

          <div className="mt-12 rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#F58220]">
              {t("common.warning")}
            </p>
            <p className="text-sm leading-7 text-slate-600">
              {t("accessControl.notAuthorized")} {t("accessControl.contactAdmin")}
              .
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
