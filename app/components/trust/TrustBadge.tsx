/**
 * TrustBadge Component
 * 
 * Displays the trust level (Excellent, Very Good, Good, etc.) with color coding.
 */

import type { TrustLevel } from '@/app/lib/trust-score';

interface TrustBadgeProps {
  /** Trust level category */
  level: TrustLevel;
  /** Optional size variant */
  size?: 'sm' | 'md';
}

/**
 * Get badge color based on trust level
 */
function getBadgeColor(level: TrustLevel): { bg: string; text: string } {
  switch (level) {
    case 'Legendary':
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    case 'Excellent':
      return { bg: 'bg-green-100', text: 'text-green-700' };
    case 'Very Good':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'Good':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'Fair':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    case 'Weak':
      return { bg: 'bg-orange-100', text: 'text-orange-700' };
    case 'Poor':
      return { bg: 'bg-red-100', text: 'text-red-700' };
  }
}

/**
 * Reusable trust level badge
 * @example
 * <TrustBadge level="Excellent" size="md" />
 */
export function TrustBadge({ level, size = 'md' }: TrustBadgeProps) {
  const { bg, text } = getBadgeColor(level);
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm';

  return (
    <span className={`inline-block rounded-full font-semibold ${bg} ${text} ${sizeClasses}`}>
      {level}
    </span>
  );
}
