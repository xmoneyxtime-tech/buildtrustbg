"use client";

import { DashboardShell } from "@/app/components/ui";
import { OnboardingHero } from "@/app/components/ui/OnboardingHero";
import { ProfileCompletionCard } from "@/app/components/ui/ProfileCompletionCard";
import { PremiumCard } from "@/app/components/ui/PremiumCard";
import { GoldVerificationCard } from "@/app/components/ui/GoldVerificationCard";
import { FeaturedCompanyCard } from "@/app/components/ui/FeaturedCompanyCard";
import { StatisticCard } from "@/app/components/ui/StatisticCard";
import { QuickActionButton } from "@/app/components/ui/QuickActionButton";
import { TrustScoreCard } from "@/app/components/trust";
import { generateMockTrustScore } from "@/app/lib/mock-trust-scores";

export default function CompanyDashboardPage() {
  // Generate sample trust score for demo (company ID "1" = consistent results)
  const trustScore = generateMockTrustScore("1");

  return (
    <DashboardShell
      role="company"
      title="Обзор"
      subtitle="Управлявайте вашия фирмен профил и растежа на вашия бизнес."
    >
      <div className="space-y-8">
        {/* Welcome Hero */}
        <OnboardingHero companyName="Вашата строителна фирма" />

        {/* Profile Completion + Premium Cards */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ProfileCompletionCard completionPercentage={75} />
          <div className="space-y-6">
            <PremiumCard />
          </div>
        </div>

        {/* Trust Score Card */}
        <TrustScoreCard result={trustScore} title="Коефициент на доверие" />

        {/* Gold Verification + Featured Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GoldVerificationCard />
          <FeaturedCompanyCard />
        </div>

        {/* Statistics Section */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Статистика</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard label="Посещения" value={0} icon="👁️" />
            <StatisticCard label="Запитвания" value={0} icon="📬" />
            <StatisticCard label="Отзиви" value={0} icon="⭐" />
            <StatisticCard label="Харесвания" value={0} icon="❤️" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Бързи действия</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionButton
              href="/company/dashboard/edit-profile"
              icon="✏️"
              label="Редактирай профил"
              description="Актуализирай информацията за твоята фирма"
            />
            <QuickActionButton
              href="/company/dashboard/gallery"
              icon="🖼️"
              label="Галерия"
              description="Добави снимки на твоите проекти"
            />
            <QuickActionButton
              href="/company/dashboard/projects"
              icon="🏗️"
              label="Проекти"
              description="Управлявай завършени проекти"
            />
            <QuickActionButton
              href="/company/dashboard/services"
              icon="⚙️"
              label="Услуги"
              description="Укажи услугите, които предлагаш"
            />
            <QuickActionButton
              href="/company/dashboard/reviews"
              icon="💬"
              label="Отзиви"
              description="Преглед на отзивите от клиенти"
            />
            <QuickActionButton
              href="/company/dashboard/messages"
              icon="💌"
              label="Съобщения"
              description="Общувай с потенциални клиенти"
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
