import { calculateTrustScore as calculateNewTrustScore } from "./calculator";
import { resolveTrustLevel } from "./helpers";
import type { TrustLevel, TrustScoreCompanyInput, TrustScoreResult } from "./types";

export function getTrustLevel(score: number): TrustLevel {
  return resolveTrustLevel(Math.round(score));
}

export function calculateTrustScore(company: TrustScoreCompanyInput): TrustScoreResult {
  const result = calculateNewTrustScore(company);

  return {
    ...result,
    overallScore: result.score,
    trustLevel: result.level,
    calculatedAt: new Date().toISOString(),
  };
}

export function quickTrustScore(
  reviewCount: number,
  averageRating: number,
  isVerified: boolean
): number {
  const reviewRatio = Math.min(reviewCount / 20, 1);
  const ratingRatio = Math.max(0, Math.min(averageRating / 5, 1));
  const verificationRatio = isVerified ? 1 : 0;

  return Math.round((reviewRatio * 40 + ratingRatio * 40 + verificationRatio * 20));
}
