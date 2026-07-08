/**
 * TrustScoreCard Component
 * 
 * Main dashboard card displaying complete trust score information.
 * Shows overall score, trust level, confidence, category breakdown, and timestamp.
 */

import type { TrustScoreResult } from '@/app/lib/trust-score';
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
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Otherwise show date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Main trust score card for dashboard display
 * @example
 * <TrustScoreCard result={trustScoreResult} title="Your Trust Score" />
 */
export function TrustScoreCard({ result, title = 'Trust Score' }: TrustScoreCardProps) {
  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-[0_4px_12px_-2px_rgba(15,76,129,0.1)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Main Score Display */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Score + Level */}
        <div className="flex flex-col items-start justify-center space-y-6">
          <TrustScore score={result.overallScore} size="lg" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <TrustBadge level={result.trustLevel} size="md" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Confidence:</span>
              <ConfidenceBadge level={result.confidenceLevel} size="md" />
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {formatTimestamp(result.calculatedAt)}
            </div>
          </div>
        </div>

        {/* Right: Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Category Scores</h3>
          <CategoryScore scores={result.categoryScores} />
        </div>
      </div>

      {/* Footer: Detailed Factors (optional) */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(result.factors).map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()
              .replace(/^./, (c) => c.toUpperCase());

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
