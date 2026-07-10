export { calculateTrustScore } from "./calculator";
export {
  computeProfileCompleteness,
  getFactorMaxPoints,
  getVerifiedBadges,
  resolveTrustLevel,
  scoreBoolean,
  scoreFromRatio,
} from "./helpers";
export { TRUST_FACTOR_WEIGHTS, TRUST_LEVELS, PROFILE_COMPLETENESS_FIELDS } from "./weights";
export type {
  CategoryScore,
  ConfidenceLevel,
  TrustCalculationInput,
  TrustBreakdownItem,
  TrustComputation,
  TrustFactorConfig,
  TrustFactorKey,
  TrustLevel,
  TrustLevelConfig,
  TrustScoreCompanyInput,
  TrustScoreResult,
  TrustSuggestion,
} from "./types";
