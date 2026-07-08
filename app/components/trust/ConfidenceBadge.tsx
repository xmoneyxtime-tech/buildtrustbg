/**
 * ConfidenceBadge Component
 * 
 * Displays the confidence level (Very High, High, Medium, Low, Very Low).
 */

import type { ConfidenceLevel } from '@/app/lib/trust-score';

interface ConfidenceBadgeProps {
  /** Confidence level */
  level: ConfidenceLevel;
  /** Optional size variant */
  size?: 'sm' | 'md';
}

/**
 * Display labels for confidence levels (English -> Bulgarian)
 */
const confidenceLevelLabels: Record<ConfidenceLevel, string> = {
  'Very High': 'Много висока',
  'High': 'Висока',
  'Medium': 'Средна',
  'Low': 'Ниска',
  'Very Low': 'Много ниска',
};

/**
 * Get badge appearance based on confidence level
 */
function getConfidenceColor(level: ConfidenceLevel): { bg: string; text: string } {
  switch (level) {
    case 'Very High':
      return { bg: 'bg-green-50', text: 'text-green-600' };
    case 'High':
      return { bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'Medium':
      return { bg: 'bg-gray-50', text: 'text-gray-600' };
    case 'Low':
      return { bg: 'bg-yellow-50', text: 'text-yellow-600' };
    case 'Very Low':
      return { bg: 'bg-red-50', text: 'text-red-600' };
  }
}

/**
 * Reusable confidence level badge
 * @example
 * <ConfidenceBadge level="High" size="md" />
 */
export function ConfidenceBadge({ level, size = 'md' }: ConfidenceBadgeProps) {
  const { bg, text } = getConfidenceColor(level);
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm';

  return (
    <span className={`inline-block rounded-full font-medium border border-current border-opacity-20 ${bg} ${text} ${sizeClasses}`}>
      {confidenceLevelLabels[level]}
    </span>
  );
}
