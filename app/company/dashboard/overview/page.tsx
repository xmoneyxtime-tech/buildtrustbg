"use client";

import { DashboardShell } from "@/app/components/ui";
import { OnboardingHero } from "@/app/components/ui/OnboardingHero";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { FeaturedCompanyCard } from "@/app/components/ui/FeaturedCompanyCard";
import { StatisticCard } from "@/app/components/ui/StatisticCard";
import { QuickActionButton } from "@/app/components/ui/QuickActionButton";
import { useTranslation } from "@/app/lib/i18n";

export default function CompanyOverviewPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.overviewTitle")}
      subtitle={t("dashboardCompany.overviewDescription")}
    >
      <div className="space-y-8">
        {/* Welcome Hero */}
        <OnboardingHero companyName="Вашата строителна фирма" />

        {/* Profile Completion + Premium Cards */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ProfileCompletionCard completionPercentage={18} />
          <div className="space-y-6">
            <PremiumCard />
          </div>
        </div>

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

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionButton
              href="/company/dashboard/edit-profile"
              icon="✏️"
              label={t("dashboardCompany.editProfile")}
              description="Update your company information"
            />
            <QuickActionButton
              href="/company/dashboard/gallery"
              icon="🖼️"
              label={t("dashboard.gallery")}
              description="Add photos of your projects"
            />
            <QuickActionButton
              href="/company/dashboard/projects"
              icon="🏗️"
              label={t("dashboard.projects")}
              description="Manage completed projects"
            />
            <QuickActionButton
              href="/company/dashboard/services"
              icon="⚙️"
              label={t("dashboard.services")}
              description="Specify services you offer"
            />
            <QuickActionButton
              href="/company/dashboard/reviews"
              icon="💬"
              label={t("dashboard.reviews")}
              description="View client reviews"
            />
            <QuickActionButton
              href="/company/dashboard/messages"
              icon="💌"
              label={t("dashboard.messages")}
              description="Communicate with potential clients"
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
