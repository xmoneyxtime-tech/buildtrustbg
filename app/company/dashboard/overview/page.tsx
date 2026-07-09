"use client";

import { DashboardShell } from "@/app/components/ui";
import { OnboardingHero } from "@/app/components/ui/OnboardingHero";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { StatisticCard } from "@/app/components/ui/StatisticCard";
import { QuickActionButton } from "@/app/components/ui/QuickActionButton";
import { useTranslation } from "@/app/lib/i18n";

export default function CompanyOverviewPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell role="company">
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

        {/* Gold Verification */}
        <GoldVerificationCard />

        {/* Statistics Section */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-slate-900">{t("dashboard.statisticsTitle")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard label={t("stats.visits")} value={0} icon="👁️" />
            <StatisticCard label={t("stats.inquiries")} value={0} icon="📬" />
            <StatisticCard label={t("stats.reviews")} value={0} icon="⭐" />
            <StatisticCard label={t("stats.likes")} value={0} icon="❤️" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-slate-900">{t("dashboard.quickActionsTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionButton
              href="/company/dashboard/edit-profile"
              icon="✏️"
              label={t("quickActions.editProfile")}
              description={t("quickActions.editProfileDesc")}
            />
            <QuickActionButton
              href="/company/dashboard/gallery"
              icon="🖼️"
              label={t("quickActions.gallery")}
              description={t("quickActions.galleryDesc")}
            />
            <QuickActionButton
              href="/company/dashboard/projects"
              icon="🏗️"
              label={t("quickActions.projects")}
              description={t("quickActions.projectsDesc")}
            />
            <QuickActionButton
              href="/company/dashboard/services"
              icon="⚙️"
              label={t("quickActions.services")}
              description={t("quickActions.servicesDesc")}
            />
            <QuickActionButton
              href="/company/dashboard/reviews"
              icon="💬"
              label={t("quickActions.reviews")}
              description={t("quickActions.reviewsDesc")}
            />
            <QuickActionButton
              href="/company/dashboard/messages"
              icon="💌"
              label={t("quickActions.messages")}
              description={t("quickActions.messagesDesc")}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
