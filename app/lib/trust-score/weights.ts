/**
 * Trust Score Engine - Configurable Weights
 * 
 * All weights are normalized to sum to 100.
 * Each weight represents the importance of that factor in the overall trust score.
 * 
 * Total: 100
 */

import type { WeightConfig } from './types';

/**
 * Default weight configuration for trust score calculation
 * 
 * Breakdown:
 * - Profile & Verification: 36 points
 * - Reviews & Ratings: 54 points  
 * - Engagement & History: 10 points
 */
export const DEFAULT_WEIGHTS: WeightConfig = {
  // Profile Completeness: How complete the company profile is (9%)
  profileCompleteness: 9,

  // Verification: Company registration verification (14%)
  verifiedCompany: 14,

  // Verification: Domain ownership verification (9%)
  verifiedDomain: 9,

  // Reviews: Number of reviews (18%)
  reviewCount: 18,

  // Reviews: Average star rating (18%)
  averageRating: 18,

  // Reviews: Consistency of ratings (9%)
  reviewConsistency: 9,

  // History: How long company has been in business (4%)
  companyAge: 4,

  // Engagement: Percentage of inquiries responded to (5%)
  responseRate: 5,

  // Engagement: How quickly they respond (5%)
  responseSpeed: 5,

  // Freshness: Recency of last review (9%)
  reviewFreshness: 9,
};

/**
 * Verify that weights sum to 100
 */
export function validateWeights(weights: WeightConfig): boolean {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  return Math.abs(total - 100) < 0.01; // Allow for floating point rounding
}

/**
 * Get total of all weights
 */
export function getWeightsTotal(weights: WeightConfig): number {
  return Object.values(weights).reduce((sum, w) => sum + w, 0);
}

/**
 * Normalize weights to sum to 100
 * Useful if weights drift due to floating point math
 */
export function normalizeWeights(weights: WeightConfig): WeightConfig {
  const total = getWeightsTotal(weights);
  if (Math.abs(total - 100) < 0.01) {
    return weights;
  }

  const factor = 100 / total;
  return {
    profileCompleteness: weights.profileCompleteness * factor,
    verifiedCompany: weights.verifiedCompany * factor,
    verifiedDomain: weights.verifiedDomain * factor,
    reviewCount: weights.reviewCount * factor,
    averageRating: weights.averageRating * factor,
    reviewConsistency: weights.reviewConsistency * factor,
    companyAge: weights.companyAge * factor,
    responseRate: weights.responseRate * factor,
    responseSpeed: weights.responseSpeed * factor,
    reviewFreshness: weights.reviewFreshness * factor,
  };
}
