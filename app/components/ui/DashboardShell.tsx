"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useTranslation } from "@/app/lib/i18n";
import { Panel } from "./Panel";
import { LanguageSwitcher } from "./LanguageSwitcher";

type DashboardShellProps = {
  role: "company" | "admin";
  children: ReactNode;
};

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems =
    role === "company"
      ? [
          { href: "/company/dashboard", label: t("dashboard.overview") },
          { href: "/company/dashboard/edit-profile", label: t("dashboard.editProfile") },
          { href: "/company/dashboard/gallery", label: t("dashboard.gallery") },
          { href: "/company/dashboard/projects", label: t("dashboard.projects") },
          { href: "/company/dashboard/services", label: t("dashboard.services") },
          { href: "/company/dashboard/messages", label: t("dashboard.messages") },
          { href: "/company/dashboard/reviews", label: t("dashboard.reviews") },
          { href: "/company/dashboard/verification-status", label: t("dashboard.verification") },
          { href: "/company/dashboard/subscription", label: t("dashboard.subscription") },
        ]
      : [
          { href: "/admin/dashboard", label: t("admin.dashboard") },
          { href: "/admin/companies", label: t("admin.title") },
          { href: "/admin/dashboard/pending-companies", label: t("admin.pendingCompanies") },
          { href: "/admin/gold-verification", label: t("dashboard.verification") },
          { href: "/admin/premium", label: t("dashboardCompany.premium") },
          { href: "/admin/dashboard/categories", label: t("admin.categories") },
          { href: "/admin/dashboard/cities", label: t("admin.cities") },
          { href: "/admin/dashboard/settings", label: t("admin.title") },
        ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
      {/* Dashboard Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-main.png"
            alt={t("header.title")}
            width={56}
            height={56}
            priority
            className="h-auto w-[44px] shrink-0 sm:w-[56px]"
            style={{ objectFit: "contain" }}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#0F4C81]">{t("header.title")}</p>
            <p className="truncate text-xs font-medium text-slate-500">
              {role === "company" ? t("auth.companyDashboard") : t("auth.adminDashboard")}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0F4C81]/20 hover:text-[#0F4C81] sm:inline-flex"
          >
            {t("navigation.home")}
          </Link>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-10 sm:px-8 lg:flex-row lg:px-10">
        <aside className="w-full shrink-0 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.2)] lg:w-72">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0F4C81] text-white shadow-sm"
                      : "text-slate-700 hover:bg-[#F8FAFC] hover:text-[#0F4C81]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1">
          <Panel className="border-none bg-transparent p-0 shadow-none">
            <div className="space-y-6">{children}</div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
