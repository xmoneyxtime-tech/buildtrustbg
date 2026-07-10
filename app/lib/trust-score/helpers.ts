import type { TrustFactorKey, TrustLevel, TrustScoreCompanyInput } from "./types";
import { PROFILE_COMPLETENESS_FIELDS, TRUST_FACTOR_WEIGHTS, TRUST_LEVELS } from "./weights";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hasText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function computeProfileCompleteness(company: TrustScoreCompanyInput): number {
  const filled = PROFILE_COMPLETENESS_FIELDS.filter((field) => {
    const value = company[field];
    if (typeof value === "string" || value === null) {
      return hasText(value);
    }

    return false;
  }).length;

  return Math.round((filled / PROFILE_COMPLETENESS_FIELDS.length) * 100);
}

export function scoreFromRatio(ratio: number, maxPoints: number): number {
  const value = clamp(ratio, 0, 1);
  return Math.round(value * maxPoints);
}

export function scoreBoolean(earned: boolean, maxPoints: number): number {
  return earned ? maxPoints : 0;
}

export function resolveTrustLevel(score: number): TrustLevel {
  const found = TRUST_LEVELS.find(
    (level) => score >= level.minScore && score <= level.maxScore
  );

  return found ? found.level : "Bronze";
}

export function getFactorMaxPoints(key: TrustFactorKey): number {
  const factor = TRUST_FACTOR_WEIGHTS.find((item) => item.key === key);

  if (!factor) {
    return 0;
  }

  return factor.maxPoints;
}

export function getVerifiedBadges(company: TrustScoreCompanyInput): string[] {
  const badges: string[] = [];

  if (company.isVerified) {
    badges.push("Verified company");
  }

  if (company.identityVerified) {
    badges.push("Identity verified");
  }

  if (company.phoneVerified) {
    badges.push("Phone verified");
  }

  return badges;
}
