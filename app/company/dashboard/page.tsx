"use client";

import { useTranslation } from "@/app/lib/i18n";
import { DashboardShell } from "@/app/components/ui";
import { OnboardingHero } from "@/app/components/ui/OnboardingHero";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { NextStepsCard } from "@/app/components/ui/NextStepsCard";
import { StatisticCard } from "@/app/components/ui/StatisticCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import Link from "next/link";

export default function CompanyDashboardPage() {
  const { t } = useTranslation();

  const nextSteps = [
    {
      icon: "🖼️",
      label: t("nextSteps.uploadLogo"),
      description: t("quickActions.editProfileDesc"),
      href: "/company/dashboard/edit-profile",
      priority: "high" as const,
    },
    {
      icon: "✏️",
      label: t("nextSteps.addDescription"),
      description: t("quickActions.editProfileDesc"),
      href: "/company/dashboard/edit-profile",
      priority: "high" as const,
    },
    {
      icon: "⚙️",
      label: t("nextSteps.addServices"),
      description: t("quickActions.servicesDesc"),
      href: "/company/dashboard/services",
      priority: "high" as const,
    },
    {
      icon: "📷",
      label: t("nextSteps.uploadGallery"),
      description: t("quickActions.galleryDesc"),
      href: "/company/dashboard/gallery",
      priority: "medium" as const,
    },
    {
      icon: "🏗️",
      label: t("nextSteps.addProjects"),
      description: t("quickActions.projectsDesc"),
      href: "/company/dashboard/projects",
      priority: "medium" as const,
    },
    {
      icon: "🛡️",
      label: t("nextSteps.startVerification"),
      description: t("dashboardCompany.verificationDescription"),
      href: "/company/dashboard/verification-status",
      priority: "medium" as const,
    },
    {
      icon: "⭐",
      label: t("nextSteps.collectReviews"),
      description: t("quickActions.reviewsDesc"),
      href: "/company/dashboard/reviews",
      priority: "medium" as const,
    },
  ];

  const quickActions = [
    { href: "/company/dashboard/edit-profile", icon: "✏️", label: t("quickActions.editProfile") },
    { href: "/company/dashboard/gallery", icon: "🖼️", label: t("quickActions.gallery") },
    { href: "/company/dashboard/projects", icon: "🏗️", label: t("quickActions.projects") },
    { href: "/company/dashboard/services", icon: "⚙️", label: t("quickActions.services") },
    { href: "/company/dashboard/reviews", icon: "💬", label: t("quickActions.reviews") },
    { href: "/company/dashboard/messages", icon: "💌", label: t("quickActions.messages") },
    { href: "/company/dashboard/verification-status", icon: "🛡️", label: t("dashboard.verification") },
    { href: "/company/dashboard/subscription", icon: "💎", label: t("dashboard.subscription") },
  ];

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.overviewTitle")}
      subtitle={t("dashboardCompany.overviewDescription")}
    >
      <div className="space-y-8">
        {/* Welcome Hero */}
        <OnboardingHero />

        {/* Top Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticCard label={t("profileCompletion.title")} value={0} icon="📋" suffix="%" />
          <StatisticCard label={t("stats.reviews")} value={0} icon="⭐" />
          <StatisticCard label={t("stats.visits")} value={0} icon="👁️" />
          <StatisticCard label={t("stats.inquiries")} value={0} icon="📬" />
        </div>

        {/* Profile Completion + Next Steps */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ProfileCompletionCard completionPercentage={0} />
          <NextStepsCard steps={nextSteps} />
        </div>

        {/* Quick Actions */}
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">{t("dashboard.quickActionsTitle")}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-[#0F4C81]/20 hover:bg-white hover:shadow-sm"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium text-slate-800 group-hover:text-[#0F4C81]">{action.label}</span>
                <span className="ml-auto text-slate-400 group-hover:text-[#0F4C81]">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GoldVerificationCard />
          <PremiumCard />
        </div>
      </div>
    </DashboardShell>
  );
}
