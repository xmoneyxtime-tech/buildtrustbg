/**
 * Trust Score Engine - Calculation Rules
 * 
 * Reusable helper functions for calculating individual trust factors.
 * Each function is isolated and can be tested independently.
 */

/**
 * Normalize a value to 0-100 range
 * @param value - The value to normalize
 * @param min - Minimum expected value (default: 0)
 * @param max - Maximum expected value (default: 100)
 * @returns Normalized value 0-100
 * 
 * @example
 * normalize(75, 0, 100) // 75
 * normalize(3, 1, 5) // 50 (middle of 1-5 range)
 */
export function normalize(value: number, min = 0, max = 100): number {
  if (max === min) return 100;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

/**
 * Clamp a value between min and max
 * @param value - The value to clamp
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 100)
 * @returns Clamped value
 * 
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100) // 50
 */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate profile completeness score
 * @param completeness - Percentage of profile fields filled (0-100)
 * @returns Score 0-100
 * 
 * Scoring:
 * - 0-30%: Poor (0-20 points)
 * - 30-60%: Fair (20-50 points)
 * - 60-85%: Good (50-85 points)
 * - 85-100%: Excellent (85-100 points)
 * 
 * @example
 * calculateProfileScore(50) // ~40
 * calculateProfileScore(85) // ~85
 */
export function calculateProfileScore(completeness: number): number {
  const normalized = clamp(completeness, 0, 100);
  
  if (normalized < 30) {
    return normalize(normalized, 0, 30) * 0.2; // 0-20
  } else if (normalized < 60) {
    return 20 + normalize(normalized, 30, 60) * 0.3; // 20-50
  } else if (normalized < 85) {
    return 50 + normalize(normalized, 60, 85) * 0.35; // 50-85
  } else {
    return 85 + normalize(normalized, 85, 100) * 0.15; // 85-100
  }
}

/**
 * Calculate review-based trust score
 * @param reviewCount - Total number of reviews
 * @param averageRating - Average rating (1-5 stars or normalized 0-100)
 * @param reviewConsistency - Consistency score (0-100, where 100 = perfectly consistent)
 * @returns Score 0-100
 * 
 * Scoring:
 * - Reviews encourage trust (more reviews = higher score, diminishing returns)
 * - Higher ratings = higher score
 * - Consistent ratings = higher score
 * 
 * @example
 * calculateReviewScore(50, 4.5, 80) // High score due to volume, rating, and consistency
 * calculateReviewScore(2, 3, 50) // Lower score due to limited data
 */
export function calculateReviewScore(
  reviewCount: number,
  averageRating: number,
  reviewConsistency: number
): number {
  // Normalize rating to 0-100 if it's on 1-5 scale
  const normalizedRating = averageRating > 5 
    ? clamp(averageRating, 0, 100) 
    : (averageRating / 5) * 100;

  // Review count: diminishing returns (logarithmic scale)
  // 1 review = 10%, 10 reviews = 50%, 100 reviews = 80%
  const reviewCountScore = Math.min(80, Math.log(reviewCount + 1) * 20);

  // Combine: rating (40%), count (35%), consistency (25%)
  return (
    normalizedRating * 0.4 +
    reviewCountScore * 0.35 +
    reviewConsistency * 0.25
  );
}

/**
 * Calculate verification score
 * @param isVerifiedCompany - Whether company is registered/verified
 * @param isVerifiedDomain - Whether domain is verified
 * @returns Score 0-100
 * 
 * Scoring:
 * - Neither verified: 0 points
 * - Domain verified: 50 points
 * - Company verified: 70 points
 * - Both verified: 100 points
 * 
 * @example
 * calculateVerificationScore(false, false) // 0
 * calculateVerificationScore(true, false) // 70
 * calculateVerificationScore(true, true) // 100
 */
export function calculateVerificationScore(
  isVerifiedCompany: boolean,
  isVerifiedDomain: boolean
): number {
  if (isVerifiedCompany && isVerifiedDomain) return 100;
  if (isVerifiedCompany) return 70;
  if (isVerifiedDomain) return 50;
  return 0;
}

/**
 * Calculate company age score
 * @param ageInYears - How long the company has existed
 * @returns Score 0-100
 * 
 * Scoring:
 * - < 1 year: 20 points (new business)
 * - 1-3 years: 40-60 points
 * - 3-5 years: 60-80 points
 * - 5+ years: 80-100 points (well-established)
 * 
 * @example
 * calculateAgeScore(0.5) // 20
 * calculateAgeScore(2) // 50-60
 * calculateAgeScore(5) // ~85
 * calculateAgeScore(10) // 100
 */
export function calculateAgeScore(ageInYears: number): number {
  if (ageInYears < 1) {
    return normalize(ageInYears, 0, 1) * 20; // 0-20
  } else if (ageInYears < 3) {
    return 20 + normalize(ageInYears, 1, 3) * 40; // 20-60
  } else if (ageInYears < 5) {
    return 60 + normalize(ageInYears, 3, 5) * 20; // 60-80
  } else {
    return Math.min(100, 80 + normalize(ageInYears, 5, 10) * 20); // 80-100
  }
}

/**
 * Calculate response engagement score
 * @param responseRate - Percentage of inquiries responded to (0-100)
 * @param averageResponseTimeHours - Average response time in hours
 * @returns Score 0-100
 * 
 * Scoring:
 * - Response rate is primary (0-100)
 * - Fast response (< 2 hours) = +10 bonus
 * - Normal response (2-24 hours) = no bonus
 * - Slow response (> 24 hours) = -20 penalty
 * 
 * @example
 * calculateResponseScore(90, 1) // ~100 (high rate + very fast)
 * calculateResponseScore(80, 12) // ~80 (good rate, normal speed)
 * calculateResponseScore(60, 48) // ~40 (ok rate but slow)
 */
export function calculateResponseScore(
  responseRate: number,
  averageResponseTimeHours: number
): number {
  const baseScore = clamp(responseRate, 0, 100);

  let adjustment = 0;
  if (averageResponseTimeHours < 2) {
    adjustment = 10; // Very responsive
  } else if (averageResponseTimeHours > 24) {
    adjustment = -20; // Slow to respond
  }

  return clamp(baseScore + adjustment, 0, 100);
}

/**
 * Calculate review freshness score
 * @param daysSinceLastReview - Days since the most recent review
 * @returns Score 0-100
 * 
 * Scoring:
 * - Fresh (< 7 days): 100 points
 * - Recent (7-30 days): 80-100 points
 * - Somewhat stale (30-90 days): 50-80 points
 * - Stale (90-180 days): 20-50 points
 * - Very stale (> 180 days): 0-20 points
 * 
 * @example
 * calculateFreshnessScore(2) // ~95 (very fresh)
 * calculateFreshnessScore(30) // ~80 (recent)
 * calculateFreshnessScore(180) // ~10 (very stale)
 */
export function calculateFreshnessScore(daysSinceLastReview: number): number {
  if (daysSinceLastReview < 7) {
    return normalize(daysSinceLastReview, 0, 7) * -4 + 100; // 100-96
  } else if (daysSinceLastReview < 30) {
    return 80 + normalize(daysSinceLastReview, 7, 30) * 20; // 80-100 (reversed)
  } else if (daysSinceLastReview < 90) {
    return 50 + normalize(daysSinceLastReview, 30, 90) * 30; // 50-80
  } else if (daysSinceLastReview < 180) {
    return 20 + normalize(daysSinceLastReview, 90, 180) * 30; // 20-50
  } else {
    return Math.max(0, 20 - normalize(daysSinceLastReview, 180, 365) * 20); // 20-0
  }
}

/**
 * Calculate review consistency score
 * Measures whether ratings cluster together or are widely dispersed
 * 
 * @param ratings - Array of individual review ratings (1-5 or 0-100)
 * @returns Score 0-100 (100 = perfectly consistent, 0 = maximally inconsistent)
 * 
 * Calculation:
 * - If < 3 reviews: return 80 (not enough data for consistency judgment)
 * - Calculate standard deviation
 * - Convert to consistency score (0 std dev = 100, high std dev = 0)
 * 
 * @example
 * calculateConsistencyScore([5, 5, 5]) // 100 (perfect consistency)
 * calculateConsistencyScore([5, 3, 1]) // ~30 (high variance)
 * calculateConsistencyScore([4, 4.5, 4, 4.5]) // ~90 (very consistent)
 */
export function calculateConsistencyScore(ratings: number[]): number {
  if (ratings.length < 3) {
    return 80; // Not enough data for statistical analysis
  }

  // Normalize ratings to 0-100 scale if needed
  const normalizedRatings = ratings.map(r => r > 5 ? r : (r / 5) * 100);

  // Calculate mean
  const mean = normalizedRatings.reduce((a, b) => a + b, 0) / normalizedRatings.length;

  // Calculate standard deviation
  const variance = normalizedRatings.reduce(
    (sum, r) => sum + Math.pow(r - mean, 2),
    0
  ) / normalizedRatings.length;
  const stdDev = Math.sqrt(variance);

  // Convert std dev to consistency score
  // Max std dev for 0-100 range is 50, so normalize to that
  const maxStdDev = 50;
  const consistency = Math.max(0, 100 - (stdDev / maxStdDev) * 100);

  return clamp(consistency, 0, 100);
}
