/**
 * TrustScore Component
 * 
 * Displays the trust score as a large number with denominator.
 * Used in TrustScoreCard and other trust-related displays.
 */

interface TrustScoreProps {
  /** Score value 0-100 */
  score: number;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable trust score number display
 * @example
 * <TrustScore score={87} size="lg" />
 */
export function TrustScore({ score, size = 'md' }: TrustScoreProps) {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-6xl',
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-[#0F4C81] ${sizeClasses[size]}`}>
        {Math.round(score)}
      </span>
      <span className={`font-medium text-gray-400 ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
        /100
      </span>
    </div>
  );
}
