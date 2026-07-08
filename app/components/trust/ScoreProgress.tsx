/**
 * ScoreProgress Component
 * 
 * Simple progress bar for displaying category scores with label and value.
 */

interface ScoreProgressProps {
  /** Label for the score */
  label: string;
  /** Score value 0-100 */
  value: number;
  /** Optional color variant */
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'gray';
}

/**
 * Get progress bar color based on variant
 */
function getProgressColor(color: string): string {
  switch (color) {
    case 'orange':
      return 'bg-[#F58220]';
    case 'blue':
      return 'bg-[#0F4C81]';
    case 'green':
      return 'bg-green-500';
    case 'purple':
      return 'bg-purple-500';
    default:
      return 'bg-gray-300';
  }
}

/**
 * Reusable progress bar for scores
 * @example
 * <ScoreProgress label="Profile" value={91} color="blue" />
 */
export function ScoreProgress({ label, value, color = 'blue' }: ScoreProgressProps) {
  const progressColor = getProgressColor(color);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{Math.round(value)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${progressColor}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
