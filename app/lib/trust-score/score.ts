/**
 * Trust Score Engine - Main Calculation
 * 
 * Core function to calculate a complete trust score for a company.
 * Returns overall score, trust level, confidence, and category breakdown.
 */

import type {
  TrustScoreResult,
  TrustCalculationInput,
  TrustLevel,
  ConfidenceLevel,
  CategoryScore,
  WeightConfig,
} from './types';

import { DEFAULT_WEIGHTS, normalizeWeights } from './weights';
import {
  clamp,
  calculateProfileScore,
  calculateAgeScore,
  calculateResponseScore,
  calculateFreshnessScore,
} from './rules';

/**
 * Determine trust level based on overall score
 * @param score - Overall score 0-100
 * @returns Trust level category
 * 
 * Scale:
 * - 95-100: Legendary
 * - 90-94: Excellent
 * - 80-89: Very Good
 * - 70-79: Good
 * - 60-69: Fair
 * - 40-59: Weak
 * - 0-39: Poor
 */
export function getTrustLevel(score: number): TrustLevel {
  if (score >= 95) return 'Legendary';
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Weak';
  return 'Poor';
}

/**
 * Determine confidence level based on data quality
 * @param reviewCount - Total number of reviews
 * @param profileCompleteness - Profile completion percentage
 * @param isVerified - Whether company is verified
 * @returns Confidence level
 * 
 * Confidence is based on:
 * - Number of reviews (more = higher confidence)
 * - Profile completeness (more complete = higher confidence)
 * - Verification status (verified = higher confidence)
 */
export function getConfidenceLevel(
  reviewCount: number,
  profileCompleteness: number,
  isVerified: boolean
): ConfidenceLevel {
  // Calculate confidence score (0-100)
  let confidenceScore = 0;

  // Review count contribution (0-40 points)
  // 0 reviews = 0, 10+ reviews = 40
  confidenceScore += clamp((reviewCount / 10) * 40, 0, 40);

  // Profile completeness contribution (0-30 points)
  confidenceScore += (profileCompleteness / 100) * 30;

  // Verification contribution (0-30 points)
  confidenceScore += isVerified ? 30 : 0;

  // Map confidence score to confidence level
  if (confidenceScore >= 90) return 'Very High';
  if (confidenceScore >= 75) return 'High';
  if (confidenceScore >= 50) return 'Medium';
  if (confidenceScore >= 25) return 'Low';
  return 'Very Low';
}

/**
 * Calculate category scores
 * @param factors - Individual factor scores
 * @returns Category breakdown
 */
export function calculateCategoryScores(
  factors: Record<string, number>
): CategoryScore {
  return {
    Profile: (factors.profileCompleteness + factors.verifiedCompany + factors.verifiedDomain) / 3,
    Reviews: (factors.reviewCount + factors.averageRating + factors.reviewConsistency) / 3,
    Verification: (factors.verifiedCompany + factors.verifiedDomain) / 2,
    Engagement: (factors.responseRate + factors.responseSpeed) / 2,
    Reputation: (factors.companyAge + factors.reviewFreshness + factors.reviewConsistency) / 3,
  };
}

/**
 * Main trust score calculation function
 * 
 * Calculates a comprehensive trust score for a company based on multiple factors.
 * Uses weighted calculation with normalized scores.
 * 
 * @param input - Company data for calculation
 * @param weights - Custom weight configuration (optional, uses defaults)
 * @returns Complete trust score result
 * 
 * @example
 * const input: TrustCalculationInput = {
 *   profileCompleteness: 85,
 *   isVerifiedCompany: true,
 *   isVerifiedDomain: true,
 *   reviewCount: 25,
 *   averageRating: 4.5,
 *   reviewConsistency: 75,
 *   companyAgeInYears: 3,
 *   responseRate: 90,
 *   averageResponseTimeHours: 4,
 *   daysSinceLastReview: 5,
 * };
 * 
 * const result = calculateTrustScore(input);
 * console.log(result);
 * // {
 * //   overallScore: 82.5,
 * //   trustLevel: 'Very Good',
 * //   confidenceLevel: 'Very High',
 * //   categoryScores: { ... },
 * //   factors: { ... },
 * //   calculatedAt: '2024-01-15T10:30:00.000Z'
 * // }
 */
export function calculateTrustScore(
  input: TrustCalculationInput,
  weights: Partial<WeightConfig> = {}
): TrustScoreResult {
  // Merge custom weights with defaults
  const finalWeights = normalizeWeights({ ...DEFAULT_WEIGHTS, ...weights });

  // Calculate individual factor scores
  const profileScore = calculateProfileScore(input.profileCompleteness);
  const ageScore = calculateAgeScore(input.companyAgeInYears);
  const responseScore = calculateResponseScore(
    input.responseRate,
    input.averageResponseTimeHours
  );
  const freshnessScore = calculateFreshnessScore(input.daysSinceLastReview);

  // For consistency score, we use the aggregate reviewConsistency data
  // In a real scenario with individual reviews, this would be calculated from raw ratings
  const consistencyScore = input.reviewConsistency;

  // Store individual factor scores
  const factors = {
    profileCompleteness: profileScore,
    verifiedCompany: input.isVerifiedCompany ? 100 : 0,
    verifiedDomain: input.isVerifiedDomain ? 100 : 0,
    reviewCount: clamp((input.reviewCount / 50) * 100, 0, 100), // Normalize: 50+ reviews = 100
    averageRating: input.averageRating > 5 
      ? clamp(input.averageRating, 0, 100)
      : (input.averageRating / 5) * 100,
    reviewConsistency: consistencyScore,
    companyAge: ageScore,
    responseRate: input.responseRate,
    responseSpeed: responseScore,
    reviewFreshness: freshnessScore,
  };

  // Calculate weighted overall score
  const overallScore = clamp(
    (factors.profileCompleteness * (finalWeights.profileCompleteness / 100) +
      factors.verifiedCompany * (finalWeights.verifiedCompany / 100) +
      factors.verifiedDomain * (finalWeights.verifiedDomain / 100) +
      factors.reviewCount * (finalWeights.reviewCount / 100) +
      factors.averageRating * (finalWeights.averageRating / 100) +
      factors.reviewConsistency * (finalWeights.reviewConsistency / 100) +
      factors.companyAge * (finalWeights.companyAge / 100) +
      factors.responseRate * (finalWeights.responseRate / 100) +
      factors.responseSpeed * (finalWeights.responseSpeed / 100) +
      factors.reviewFreshness * (finalWeights.reviewFreshness / 100)),
    0,
    100
  );

  // Determine trust level and confidence
  const trustLevel = getTrustLevel(overallScore);
  const isVerified = input.isVerifiedCompany || input.isVerifiedDomain;
  const confidenceLevel = getConfidenceLevel(
    input.reviewCount,
    input.profileCompleteness,
    isVerified
  );

  // Calculate category scores
  const categoryScores = calculateCategoryScores(factors);

  return {
    overallScore: Math.round(overallScore * 10) / 10, // Round to 1 decimal
    trustLevel,
    confidenceLevel,
    categoryScores: {
      Profile: Math.round(categoryScores.Profile * 10) / 10,
      Reviews: Math.round(categoryScores.Reviews * 10) / 10,
      Verification: Math.round(categoryScores.Verification * 10) / 10,
      Engagement: Math.round(categoryScores.Engagement * 10) / 10,
      Reputation: Math.round(categoryScores.Reputation * 10) / 10,
    },
    factors: Object.fromEntries(
      Object.entries(factors).map(([key, val]) => [
        key,
        Math.round(val * 10) / 10,
      ])
    ),
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Quick score calculation (minimal input)
 * Useful for simple trust score display where full data isn't available
 * 
 * @param reviewCount - Number of reviews
 * @param averageRating - Average rating
 * @param isVerified - Is company verified
 * @returns Simplified trust score 0-100
 * 
 * @example
 * quickTrustScore(25, 4.5, true) // ~75
 */
export function quickTrustScore(
  reviewCount: number,
  averageRating: number,
  isVerified: boolean
): number {
  const ratingScore = (averageRating / 5) * 100;
  const reviewScore = clamp((reviewCount / 20) * 100, 0, 100);
  const verificationScore = isVerified ? 100 : 40;

  return clamp(
    ratingScore * 0.4 + reviewScore * 0.4 + verificationScore * 0.2,
    0,
    100
  );
}
