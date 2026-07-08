/**
 * CategoryScore Component
 * 
 * Displays all five category scores (Profile, Reviews, Verification, Engagement, Reputation)
 * with progress bars.
 */

import type { CategoryScore } from '@/app/lib/trust-score';
import { ScoreProgress } from './ScoreProgress';

interface CategoryScoreProps {
  /** Category scores object */
  scores: CategoryScore;
}

/**
 * Color mapping for each category
 */
const categoryColors: Record<keyof CategoryScore, 'orange' | 'blue' | 'green' | 'purple' | 'gray'> = {
  Profile: 'orange',
  Reviews: 'green',
  Verification: 'blue',
  Engagement: 'purple',
  Reputation: 'gray',
};

/**
 * Display all category scores with progress bars
 * @example
 * <CategoryScore scores={result.categoryScores} />
 */
export function CategoryScore({ scores }: CategoryScoreProps) {
  const categories: (keyof CategoryScore)[] = ['Profile', 'Reviews', 'Verification', 'Engagement', 'Reputation'];

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <ScoreProgress
          key={category}
          label={category}
          value={scores[category]}
          color={categoryColors[category]}
        />
      ))}
    </div>
  );
}
