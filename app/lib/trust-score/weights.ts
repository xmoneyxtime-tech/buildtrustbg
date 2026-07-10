import type { TrustFactorConfig, TrustLevelConfig } from "./types";

export const TRUST_FACTOR_WEIGHTS: TrustFactorConfig[] = [
  { key: "verifiedCompany", label: "Verified company", maxPoints: 8 },
  { key: "identityVerified", label: "Identity verified", maxPoints: 6 },
  { key: "profileCompleteness", label: "Profile completeness", maxPoints: 14 },
  { key: "logoUploaded", label: "Logo uploaded", maxPoints: 3 },
  { key: "coverUploaded", label: "Cover image uploaded", maxPoints: 3 },
  { key: "website", label: "Website", maxPoints: 4 },
  { key: "phone", label: "Phone", maxPoints: 4 },
  { key: "description", label: "Description", maxPoints: 4 },
  { key: "portfolio", label: "Portfolio", maxPoints: 6 },
  { key: "projects", label: "Projects", maxPoints: 6 },
  { key: "reviews", label: "Reviews", maxPoints: 8 },
  { key: "averageRating", label: "Average rating", maxPoints: 8 },
  { key: "yearsInBusiness", label: "Years in business", maxPoints: 6 },
  { key: "certificates", label: "Certificates", maxPoints: 6 },
  { key: "gallery", label: "Gallery", maxPoints: 6 },
  { key: "responseTime", label: "Response time", maxPoints: 4 },
  { key: "activeSubscription", label: "Active subscription", maxPoints: 4 },
];

export const TRUST_LEVELS: TrustLevelConfig[] = [
  { level: "Bronze", minScore: 0, maxScore: 39 },
  { level: "Silver", minScore: 40, maxScore: 69 },
  { level: "Gold", minScore: 70, maxScore: 89 },
  { level: "Platinum", minScore: 90, maxScore: 100 },
];

export const PROFILE_COMPLETENESS_FIELDS = [
  "companyName",
  "description",
  "industry",
  "website",
  "phone",
  "email",
  "country",
  "city",
  "address",
  "logoUrl",
  "coverUrl",
] as const;
