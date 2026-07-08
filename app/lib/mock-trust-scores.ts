/**
 * Trust Score Mock Data Generator
 * 
 * Generates sample trust scores for demo/mock data.
 * Uses the Trust Score Engine with realistic demo inputs.
 */

import { calculateTrustScore } from './trust-score';
import type { TrustScoreResult, TrustCalculationInput } from './trust-score';

/**
 * Generate a trust score for a company based on company ID
 * Uses deterministic values so same company always gets same score
 * 
 * @param companyId - Company ID for consistent results
 * @returns Trust score result
 */
export function generateMockTrustScore(companyId: string): TrustScoreResult {
  // Create deterministic but varied inputs based on company ID
  const idNum = parseInt(companyId);
  const seed = (idNum * 7) % 100; // Pseudo-random seed

  const input: TrustCalculationInput = {
    // Profile: 60-95 range
    profileCompleteness: 60 + ((seed * 3) % 36),

    // Verification: varied
    isVerifiedCompany: seed > 30,
    isVerifiedDomain: seed > 50,

    // Reviews: 0-80 reviews
    reviewCount: Math.floor((seed * 0.8) % 81),

    // Rating: 3.0-5.0 stars
    averageRating: 3.0 + ((seed % 20) * 0.1),

    // Consistency: 40-95
    reviewConsistency: 40 + ((seed * 0.55) % 56),

    // Company Age: 0.5-8 years
    companyAgeInYears: 0.5 + ((seed % 75) * 0.1),

    // Response Rate: 50-100%
    responseRate: 50 + ((seed * 0.5) % 51),

    // Response Time: 2-48 hours
    averageResponseTimeHours: 2 + ((seed % 46) * 1),

    // Freshness: 1-90 days
    daysSinceLastReview: 1 + ((seed % 89) * 1),
  };

  return calculateTrustScore(input);
}

/**
 * Generate trust scores for multiple companies
 * @param companies - Array of company objects with id and name
 * @returns Record mapping company ID to trust score result
 */
export function generateMockTrustScores(
  companies: Array<{ id: string; name: string }>
): Record<string, TrustScoreResult> {
  const scores: Record<string, TrustScoreResult> = {};

  companies.forEach((company) => {
    scores[company.id] = generateMockTrustScore(company.id);
  });

  return scores;
}
