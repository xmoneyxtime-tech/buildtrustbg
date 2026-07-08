/**
 * AI Review Intelligence - Main Export
 *
 * Barrel export of all types, functions, and utilities for review analysis.
 * This is the main entry point for the AI review system.
 *
 * @example
 * import { analyzeReview, analyzeBatch, ReviewAnalysis } from '@/lib/ai-review';
 *
 * const analysis = analyzeReview("Great service!", "review-1");
 */

// Types
export type {
  ReviewSentiment,
  AIConfidence,
  ReviewFlagType,
  ReviewFlag,
  ReviewSentimentAnalysis,
  ReviewSummary,
  ReviewInsight,
  ReviewAnalysis,
  BatchReviewAnalysis,
  AnalysisConfig,
} from './types';

// Sentiment Analysis
export {
  analyzeSentiment,
  isPositive,
  isNegative,
  getSentimentLabel,
  getSentimentEmoji,
} from './sentiment';

// Flag Detection
export {
  detectSpam,
  detectFakeReview,
  detectPersonalInfo,
  detectAggressiveLanguage,
  detectAdvertisement,
  detectDuplicateContent,
  detectVeryShortReview,
  detectSuspiciousPattern,
  detectAllFlags,
  isSpamLikely,
  isFakeLikely,
  getQualityFromFlags,
} from './flags';

// Summary and Keywords
export {
  extractKeywords,
  extractMainTopics,
  generateSummary,
  generateReviewSummary,
  analyzeSentimentDistribution,
} from './summary';

// Main Analysis Functions
export {
  analyzeReview,
  analyzeBatch,
  quickAnalyze,
  getQualityLabel,
  getOverallRisk,
} from './analysis';
