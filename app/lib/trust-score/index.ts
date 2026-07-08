/**
 * Trust Score Engine - Public API
 * 
 * Complete export of all types and functions.
 * This is the main entry point for the trust score engine.
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  TrustFactor,
  TrustScoreResult,
  TrustLevel,
  ConfidenceLevel,
  CategoryScore,
  TrustCalculationInput,
  WeightConfig,
} from './types';

// ============================================================================
// WEIGHTS & CONFIGURATION
// ============================================================================

export {
  DEFAULT_WEIGHTS,
  validateWeights,
  getWeightsTotal,
  normalizeWeights,
} from './weights';

// ============================================================================
// CALCULATION RULES
// ============================================================================

export {
  normalize,
  clamp,
  calculateProfileScore,
  calculateReviewScore,
  calculateVerificationScore,
  calculateAgeScore,
  calculateResponseScore,
  calculateFreshnessScore,
  calculateConsistencyScore,
} from './rules';

// ============================================================================
// MAIN CALCULATION
// ============================================================================

export {
  calculateTrustScore,
  getTrustLevel,
  getConfidenceLevel,
  calculateCategoryScores,
  quickTrustScore,
} from './score';
