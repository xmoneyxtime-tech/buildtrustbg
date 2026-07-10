export type TrustLevel =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Legendary"
  | "Excellent"
  | "Very Good"
  | "Good"
  | "Fair"
  | "Weak"
  | "Poor";

export type ConfidenceLevel =
  | "Very High"
  | "High"
  | "Medium"
  | "Low"
  | "Very Low";

export type CategoryScore = {
  Profile: number;
  Reviews: number;
  Verification: number;
  Engagement: number;
  Reputation: number;
};

export type TrustFactorKey =
  | "verifiedCompany"
  | "identityVerified"
  | "profileCompleteness"
  | "logoUploaded"
  | "coverUploaded"
  | "website"
  | "phone"
  | "description"
  | "portfolio"
  | "projects"
  | "reviews"
  | "averageRating"
  | "yearsInBusiness"
  | "certificates"
  | "gallery"
  | "responseTime"
  | "activeSubscription";

export type TrustBreakdownItem = {
  key: TrustFactorKey;
  label: string;
  points: number;
  earned: boolean;
};

export type TrustSuggestion = {
  key: TrustFactorKey;
  label: string;
  missingPoints: number;
};

export type TrustScoreResult = {
  score: number;
  level: TrustLevel;
  profileCompleteness: number;
  breakdown: TrustBreakdownItem[];
  suggestions: TrustSuggestion[];
  verifiedBadges: string[];
  overallScore?: number;
  trustLevel?: TrustLevel;
  confidenceLevel?: ConfidenceLevel;
  categoryScores?: CategoryScore;
  factors?: Record<string, number>;
  calculatedAt?: string;
};

export type TrustScoreCompanyInput = {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  description: string;
  industry: string | null;
  website: string | null;
  country: string | null;
  city: string;
  address: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  isVerified: boolean;
  identityVerified: boolean;
  phoneVerified: boolean;
  portfolioCount: number;
  projectsCount: number;
  reviewsCount: number;
  averageRating: number;
  yearsInBusiness: number | null;
  certificatesCount: number;
  galleryCount: number;
  responseTimeHours: number | null;
  activeSubscription: boolean;
};

export type TrustCalculationInput = {
  profileCompleteness: number;
  isVerifiedCompany: boolean;
  isVerifiedDomain: boolean;
  reviewCount: number;
  averageRating: number;
  reviewConsistency: number;
  companyAgeInYears: number;
  responseRate: number;
  averageResponseTimeHours: number;
  daysSinceLastReview: number;
};

export type TrustFactorConfig = {
  key: TrustFactorKey;
  label: string;
  maxPoints: number;
};

export type TrustLevelConfig = {
  level: TrustLevel;
  minScore: number;
  maxScore: number;
};

export type TrustComputation = {
  score: number;
  level: TrustLevel;
  profileCompleteness: number;
  breakdown: TrustBreakdownItem[];
  suggestions: TrustSuggestion[];
  verifiedBadges: string[];
};
