/**
 * Trust Score Engine Types
 * 
 * Complete type definitions for the trust score calculation system.
 * All types are exported for use across the platform.
 */

/**
 * Individual trust factor with its score and weight
 */
export type TrustFactor = {
  score: number; // 0-100
  weight: number; // normalized to 0-1
  name: string;
};

/**
 * Trust level categories based on overall score
 */
export type TrustLevel =
  | 'Legendary'    // 95-100
  | 'Excellent'    // 90-94
  | 'Very Good'    // 80-89
  | 'Good'         // 70-79
  | 'Fair'         // 60-69
  | 'Weak'         // 40-59
  | 'Poor';        // 0-39

/**
 * Confidence level in the trust score result
 */
export type ConfidenceLevel =
  | 'Very High'    // >= 90% confidence
  | 'High'         // >= 75% confidence
  | 'Medium'       // >= 50% confidence
  | 'Low'          // >= 25% confidence
  | 'Very Low';    // < 25% confidence

/**
 * Category scores breakdown
 */
export type CategoryScore = {
  Profile: number;          // Profile completeness & verification
  Reviews: number;          // Review count, rating, consistency
  Verification: number;     // Company & domain verification
  Engagement: number;       // Response rate & speed
  Reputation: number;       // Age, freshness, consistency
};

/**
 * Input data for trust score calculation
 */
export type TrustCalculationInput = {
  // Profile
  profileCompleteness: number; // 0-100 (percentage of fields filled)
  
  // Verification
  isVerifiedCompany: boolean;
  isVerifiedDomain: boolean;
  
  // Reviews
  reviewCount: number; // total number of reviews
  averageRating: number; // 1-5 or normalized 0-100
  reviewConsistency: number; // 0-100 (std dev of ratings)
  
  // Company History
  companyAgeInYears: number; // how long company has existed
  
  // Engagement
  responseRate: number; // 0-100 (percentage of inquiries responded to)
  averageResponseTimeHours: number; // how fast they respond
  
  // Freshness
  daysSinceLastReview: number; // how recent the last review is
};

/**
 * Complete trust score calculation result
 */
export type TrustScoreResult = {
  overallScore: number; // 0-100
  trustLevel: TrustLevel;
  confidenceLevel: ConfidenceLevel;
  categoryScores: CategoryScore;
  factors: Record<string, number>; // individual factor scores
  calculatedAt: string; // ISO timestamp
};

/**
 * Raw weight configuration before normalization
 */
export type WeightConfig = {
  profileCompleteness: number;
  verifiedCompany: number;
  verifiedDomain: number;
  reviewCount: number;
  averageRating: number;
  reviewConsistency: number;
  companyAge: number;
  responseRate: number;
  responseSpeed: number;
  reviewFreshness: number;
};
