"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Panel } from "./Panel";

type DashboardShellProps = {
  role: "company" | "admin";
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardShell({ role, title, subtitle, children }: DashboardShellProps) {
  const pathname = usePathname();
  const navItems =
    role === "company"
      ? [
          { href: "/company/dashboard", label: "Обзор" },
          { href: "/company/dashboard/overview", label: "Overview" },
          { href: "/company/dashboard/edit-profile", label: "Edit Profile" },
          { href: "/company/dashboard/gallery", label: "Gallery" },
          { href: "/company/dashboard/projects", label: "Projects" },
          { href: "/company/dashboard/services", label: "Services" },
          { href: "/company/dashboard/messages", label: "Messages" },
          { href: "/company/dashboard/reviews", label: "Reviews" },
          { href: "/company/dashboard/verification-status", label: "Verification Status" },
          { href: "/company/dashboard/subscription", label: "Subscription" },
        ]
      : [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/dashboard/pending-companies", label: "Pending Companies" },
          { href: "/admin/dashboard/approved-companies", label: "Approved Companies" },
          { href: "/admin/dashboard/rejected-companies", label: "Rejected Companies" },
          { href: "/admin/dashboard/users", label: "Users" },
          { href: "/admin/dashboard/reviews", label: "Reviews" },
          { href: "/admin/dashboard/categories", label: "Categories" },
          { href: "/admin/dashboard/cities", label: "Cities" },
          { href: "/admin/dashboard/homepage", label: "Homepage" },
          { href: "/admin/dashboard/settings", label: "Settings" },
        ];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:px-10">
      <aside className="w-full shrink-0 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.2)] lg:w-72">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
            {role === "company" ? "Company Portal" : "Admin Portal"}
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">BuildTrustBG</h2>
        </div>
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
          <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.2)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">{role === "company" ? "Company Dashboard" : "Admin Dashboard"}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="max-w-2xl text-base leading-8 text-slate-700">{subtitle}</p>
          </div>
          <div className="space-y-6">{children}</div>
        </Panel>
      </section>
    </div>
  );
}
