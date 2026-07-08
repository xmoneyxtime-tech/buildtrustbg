"use client";

import { useTranslation } from "@/app/lib/i18n";
import { DashboardShell } from "@/app/components/ui";
import { OnboardingHero } from "@/app/components/ui/OnboardingHero";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { FeaturedCompanyCard } from "@/app/components/ui/FeaturedCompanyCard";
import { StatisticCard } from "@/app/components/ui/StatisticCard";
import { QuickActionButton } from "@/app/components/ui/QuickActionButton";
import { NextStepsCard } from "@/app/components/ui/NextStepsCard";
import { TrustScoreCard } from "@/app/components/trust";
import { generateMockTrustScore } from "@/app/lib/mock-trust-scores";

export default function CompanyDashboardPage() {
  const { t } = useTranslation();

  // Generate sample trust score for demo (company ID "1" = consistent results)
  const trustScore = generateMockTrustScore("1");

  // Define next steps for onboarding
  const nextSteps = [
    {
      icon: "✏️",
      label: t("quickActions.editProfile"),
      description: t("quickActions.editProfileDesc"),
      href: "/company/dashboard/edit-profile",
      priority: "high" as const,
    },
    {
      icon: "⚙️",
      label: t("quickActions.services"),
      description: t("quickActions.servicesDesc"),
      href: "/company/dashboard/services",
      priority: "high" as const,
    },
    {
      icon: "🖼️",
      label: t("quickActions.gallery"),
      description: t("quickActions.galleryDesc"),
      href: "/company/dashboard/gallery",
      priority: "high" as const,
    },
    {
      icon: "🏗️",
      label: t("quickActions.projects"),
      description: t("quickActions.projectsDesc"),
      href: "/company/dashboard/projects",
      priority: "medium" as const,
    },
    {
      icon: "💬",
      label: t("quickActions.reviews"),
      description: t("quickActions.reviewsDesc"),
      href: "/company/dashboard/reviews",
      priority: "medium" as const,
    },
    {
      icon: "💌",
      label: t("quickActions.messages"),
      description: t("quickActions.messagesDesc"),
      href: "/company/dashboard/messages",
      priority: "medium" as const,
    },
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

        {/* Profile Completion + Premium Cards */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ProfileCompletionCard completionPercentage={0} />
          <div className="space-y-6">
            <PremiumCard />
          </div>
        </div>

        {/* Trust Score Card */}
        <TrustScoreCard result={trustScore} />

        {/* Gold Verification + Featured Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GoldVerificationCard />
          <FeaturedCompanyCard />
        </div>

        {/* Statistics Section */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">{t("stats.visits")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard label={t("stats.visits")} value={0} icon="👁️" />
            <StatisticCard label={t("stats.inquiries")} value={0} icon="📬" />
            <StatisticCard label={t("stats.reviews")} value={0} icon="⭐" />
            <StatisticCard label={t("stats.likes")} value={0} icon="❤️" />
          </div>
        </div>

        {/* Next Steps Card */}
        <NextStepsCard steps={nextSteps} />

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">{t("quickActions.title")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nextSteps.map((step, idx) => (
              <QuickActionButton
                key={idx}
                href={step.href}
                icon={step.icon}
                label={step.label}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
