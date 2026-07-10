import type {
  TrustBreakdownItem,
  TrustComputation,
  TrustCalculationInput,
  TrustFactorKey,
  TrustScoreCompanyInput,
  TrustScoreResult,
  TrustSuggestion,
} from "./types";
import { computeProfileCompleteness, getFactorMaxPoints, getVerifiedBadges, resolveTrustLevel, scoreBoolean, scoreFromRatio } from "./helpers";
import { TRUST_FACTOR_WEIGHTS } from "./weights";

function isLegacyInput(value: TrustScoreCompanyInput | TrustCalculationInput): value is TrustCalculationInput {
  return "profileCompleteness" in value;
}

function fromLegacyInput(input: TrustCalculationInput): TrustScoreCompanyInput {
  return {
    id: "legacy",
    companyName: "legacy-company",
    email: "legacy@example.com",
    phone: "n/a",
    description: input.profileCompleteness >= 30 ? "Profile" : "",
    industry: null,
    website: input.profileCompleteness >= 40 ? "https://example.com" : null,
    country: null,
    city: "n/a",
    address: null,
    logoUrl: null,
    coverUrl: null,
    isVerified: input.isVerifiedCompany,
    identityVerified: input.isVerifiedDomain,
    phoneVerified: input.responseRate >= 70,
    portfolioCount: Math.round(input.profileCompleteness / 20),
    projectsCount: Math.round(input.companyAgeInYears),
    reviewsCount: input.reviewCount,
    averageRating: input.averageRating,
    yearsInBusiness: Math.round(input.companyAgeInYears),
    certificatesCount: 0,
    galleryCount: Math.round(input.profileCompleteness / 10),
    responseTimeHours: Math.round(input.averageResponseTimeHours),
    activeSubscription: false,
  };
}

function buildBreakdown(company: TrustScoreCompanyInput): {
  profileCompleteness: number;
  breakdown: TrustBreakdownItem[];
} {
  const profileCompleteness = computeProfileCompleteness(company);

  const pointsByKey: Record<TrustFactorKey, number> = {
    verifiedCompany: scoreBoolean(company.isVerified, getFactorMaxPoints("verifiedCompany")),
    identityVerified: scoreBoolean(company.identityVerified, getFactorMaxPoints("identityVerified")),
    profileCompleteness: scoreFromRatio(profileCompleteness / 100, getFactorMaxPoints("profileCompleteness")),
    logoUploaded: scoreBoolean(Boolean(company.logoUrl), getFactorMaxPoints("logoUploaded")),
    coverUploaded: scoreBoolean(Boolean(company.coverUrl), getFactorMaxPoints("coverUploaded")),
    website: scoreBoolean(Boolean(company.website), getFactorMaxPoints("website")),
    phone: scoreBoolean(Boolean(company.phone), getFactorMaxPoints("phone")),
    description: scoreBoolean(Boolean(company.description), getFactorMaxPoints("description")),
    portfolio: scoreFromRatio(company.portfolioCount / 10, getFactorMaxPoints("portfolio")),
    projects: scoreFromRatio(company.projectsCount / 10, getFactorMaxPoints("projects")),
    reviews: scoreFromRatio(company.reviewsCount / 20, getFactorMaxPoints("reviews")),
    averageRating: scoreFromRatio(company.averageRating / 5, getFactorMaxPoints("averageRating")),
    yearsInBusiness: scoreFromRatio((company.yearsInBusiness ?? 0) / 10, getFactorMaxPoints("yearsInBusiness")),
    certificates: scoreFromRatio(company.certificatesCount / 5, getFactorMaxPoints("certificates")),
    gallery: scoreFromRatio(company.galleryCount / 15, getFactorMaxPoints("gallery")),
    responseTime: scoreFromRatio(
      company.responseTimeHours === null ? 0 : (48 - Math.min(company.responseTimeHours, 48)) / 48,
      getFactorMaxPoints("responseTime")
    ),
    activeSubscription: scoreBoolean(company.activeSubscription, getFactorMaxPoints("activeSubscription")),
  };

  const breakdown = TRUST_FACTOR_WEIGHTS.map((factor) => {
    const points = pointsByKey[factor.key];
    return {
      key: factor.key,
      label: factor.label,
      points,
      earned: points >= factor.maxPoints,
    } satisfies TrustBreakdownItem;
  });

  return {
    profileCompleteness,
    breakdown,
  };
}

function buildSuggestions(breakdown: TrustBreakdownItem[]): TrustSuggestion[] {
  return breakdown
    .filter((item) => !item.earned)
    .map((item) => ({
      key: item.key,
      label: item.label,
      missingPoints: getFactorMaxPoints(item.key) - item.points,
    }))
    .filter((item) => item.missingPoints > 0)
    .sort((a, b) => b.missingPoints - a.missingPoints);
}

function compute(company: TrustScoreCompanyInput): TrustComputation {
  const { profileCompleteness, breakdown } = buildBreakdown(company);
  const score = breakdown.reduce((sum, item) => sum + item.points, 0);
  const level = resolveTrustLevel(score);
  const suggestions = buildSuggestions(breakdown);
  const verifiedBadges = getVerifiedBadges(company);

  return {
    score,
    level,
    profileCompleteness,
    breakdown,
    suggestions,
    verifiedBadges,
  };
}

export function calculateTrustScore(
  input: TrustScoreCompanyInput | TrustCalculationInput
): TrustScoreResult {
  const company = isLegacyInput(input) ? fromLegacyInput(input) : input;
  const result = compute(company);

  return {
    ...result,
    overallScore: result.score,
    trustLevel: result.level,
    confidenceLevel: "Medium",
    categoryScores: {
      Profile: result.profileCompleteness,
      Reviews: result.breakdown
        .filter((item) => item.key === "reviews" || item.key === "averageRating")
        .reduce((sum, item) => sum + item.points, 0),
      Verification: result.breakdown
        .filter((item) => item.key === "verifiedCompany" || item.key === "identityVerified")
        .reduce((sum, item) => sum + item.points, 0),
      Engagement: result.breakdown
        .filter((item) => item.key === "responseTime")
        .reduce((sum, item) => sum + item.points, 0),
      Reputation: result.breakdown
        .filter((item) => item.key === "yearsInBusiness" || item.key === "certificates")
        .reduce((sum, item) => sum + item.points, 0),
    },
    factors: Object.fromEntries(result.breakdown.map((item) => [item.key, item.points])),
    calculatedAt: new Date().toISOString(),
  };
}
