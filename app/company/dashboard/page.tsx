"use client";

import { useTranslation } from "@/app/lib/i18n";
import { DashboardShell } from "@/app/components/ui";
import { PremiumHero } from "@/app/components/ui/PremiumHero";
import { KPICard } from "@/app/components/ui/KPICard";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { NextStepsCard } from "@/app/components/ui/NextStepsCard";
import { ActivityTimeline } from "@/app/components/ui/ActivityTimeline";
import { AIInsightsCard } from "@/app/components/ui/AIInsightsCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { QuickActionsCard } from "@/app/components/ui/QuickActionsCard";

export default function CompanyDashboardPage() {
  const { t } = useTranslation();

  // Demo data - in a real app, this would come from your API
  const companyData = {
    name: "Tech Solutions Ltd",
    trustScore: 0,
    profileCompletion: 0,
    isVerified: false,
    isPremium: false,
  };

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
  ];

  return (
    <DashboardShell role="company">
      <div className="space-y-8">
        {/* Premium Hero Section */}
        <PremiumHero
          companyName={companyData.name}
          trustScore={companyData.trustScore}
          isVerified={companyData.isVerified}
          isPremium={companyData.isPremium}
        />

        {/* KPI Cards Grid - 6 Cards */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-slate-900">{t("dashboard.statisticsTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <KPICard
              label={t("dashboardCompany.kpiProfileViews")}
              value={0}
              icon="👁️"
              subtext={t("dashboardCompany.kpiLast30Days")}
            />
            <KPICard
              label={t("dashboardCompany.kpiReviews")}
              value={0}
              icon="⭐"
              subtext={t("dashboardCompany.kpiAverage") + ": 4.5"}
            />
            <KPICard
              label={t("dashboardCompany.kpiProjects")}
              value={0}
              icon="🏗️"
              subtext={t("dashboardCompany.kpiCompleted")}
            />
            <KPICard
              label={t("dashboardCompany.kpiGallery")}
              value={0}
              icon="🖼️"
              subtext={t("dashboardCompany.kpiImagesUploaded")}
            />
            <KPICard
              label={t("dashboardCompany.kpiMessages")}
              value={0}
              icon="💬"
              subtext={t("dashboardCompany.kpiLast30Days")}
            />
            <KPICard
              label={t("dashboardCompany.kpiServices")}
              value={0}
              icon="⚙️"
              subtext={t("dashboardCompany.kpiCompleted")}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsCard />

        {/* Profile Completion + AI Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCompletionCard completionPercentage={companyData.profileCompletion} />
          <AIInsightsCard />
        </div>

        {/* Activity Timeline + Next Steps */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ActivityTimeline />
          <NextStepsCard steps={nextSteps} />
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
