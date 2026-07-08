/**
 * TrustScoreCard Component
 * 
 * Main dashboard card displaying complete trust score information.
 * Shows overall score, trust level, confidence, category breakdown, and timestamp.
 */

"use client";

import type { TrustScoreResult } from '@/app/lib/trust-score';
import { useTranslation } from '@/app/lib/i18n';
import { TrustScore } from './TrustScore';
import { TrustBadge } from './TrustBadge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { CategoryScore } from './CategoryScore';

interface TrustScoreCardProps {
  /** Trust score calculation result */
  result: TrustScoreResult;
  /** Optional custom title */
  title?: string;
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString: string, locale: string): string {
  const date = new Date(isoString);
  const today = new Date();

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `Today • ${time}`;
  }

  // Otherwise show date
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Display labels for factors using translation keys
 */
const factorLabelKeys: Record<string, string> = {
  profileCompleteness: 'companyProfile.profileCompletion',
  verifiedCompany: 'companyProfile.verifiedCompany',
  verifiedDomain: 'companyProfile.verifiedDomain',
  reviewCount: 'companyProfile.reviewCount',
  averageRating: 'companyProfile.averageRating',
  reviewConsistency: 'companyProfile.reviewConsistency',
  companyAge: 'companyProfile.companyAge',
  responseRate: 'companyProfile.responseRate',
  responseSpeed: 'companyProfile.responseSpeed',
  reviewFreshness: 'companyProfile.reviewFreshness',
};

/**
 * Main trust score card for dashboard display
 * @example
 * <TrustScoreCard result={trustScoreResult} title="Your Trust Score" />
 */
export function TrustScoreCard({ result, title }: TrustScoreCardProps) {
  const { t, language } = useTranslation();
  const finalTitle = title || t("trustScoreDashboard.title");
  const locale = language === 'bg' ? 'bg-BG' : 'en-US';

  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-[0_4px_12px_-2px_rgba(15,76,129,0.1)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">{finalTitle}</h2>
      </div>

      {/* Main Score Display */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Score + Level */}
        <div className="flex flex-col items-start justify-center space-y-6">
          <TrustScore score={result.overallScore} size="lg" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">{t("trustScoreDashboard.status")}:</span>
              <TrustBadge level={result.trustLevel} size="md" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">{t("trustScoreDashboard.confidence")}:</span>
              <ConfidenceBadge level={result.confidenceLevel} size="md" />
            </div>
            <div className="text-xs text-gray-500">
              {t("trustScoreDashboard.updated")}: {formatTimestamp(result.calculatedAt, locale)}
            </div>
          </div>
        </div>

        {/* Right: Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">{t("trustScoreDashboard.factorScores")}</h3>
          <CategoryScore scores={result.categoryScores} />
        </div>
      </div>

      {/* Footer: Detailed Factors (optional) */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(result.factors).map(([key, value]) => {
            const labelKey = factorLabelKeys[key];
            const label = labelKey ? t(labelKey) : key;

            return (
              <div key={key} className="text-center">
                <div className="text-xs font-medium text-gray-600">{label}</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{Math.round(value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
