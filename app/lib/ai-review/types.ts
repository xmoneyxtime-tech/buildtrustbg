/**
 * AI Review Intelligence Types
 *
 * Defines all types used for review analysis, sentiment detection, and flag detection.
 * This is the foundation for both mock and future real AI implementations.
 */

/**
 * Sentiment levels for review analysis
 * Ranges from very negative to very positive
 */
export type ReviewSentiment =
  | 'very_positive'
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'very_negative';

/**
 * Confidence levels for AI analysis
 * Indicates how confident the AI is in its analysis
 */
export type AIConfidence = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

/**
 * Types of flags that can be detected in reviews
 * Indicates potential issues, spam, or concerns
 */
export type ReviewFlagType =
  | 'spam_risk'
  | 'fake_review_risk'
  | 'duplicate_content'
  | 'personal_information'
  | 'aggressive_language'
  | 'advertisement'
  | 'very_short_review'
  | 'suspicious_pattern';

/**
 * Represents a single flag detected in a review
 */
export interface ReviewFlag {
  type: ReviewFlagType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: AIConfidence;
}

/**
 * Sentiment analysis result for a single review
 */
export interface ReviewSentimentAnalysis {
  sentiment: ReviewSentiment;
  confidence: AIConfidence;
  score: number; // -1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive
}

/**
 * Summary of a review's content
 */
export interface ReviewSummary {
  text: string;
  keywords: string[];
  mainTopics: string[];
}

/**
 * Insight generated from review analysis
 */
export interface ReviewInsight {
  title: string;
  description: string;
  frequency: 'rare' | 'occasional' | 'common' | 'very_common';
  sentiment: ReviewSentiment;
  supportingCount?: number; // How many reviews support this insight
}

/**
 * Complete analysis result for a single review
 */
export interface ReviewAnalysis {
  reviewId: string;
  text: string;
  sentiment: ReviewSentimentAnalysis;
  flags: ReviewFlag[];
  summary: ReviewSummary;
  isSpamLikely: boolean;
  isFakeLikely: boolean;
  overallQuality: 'low' | 'medium' | 'high';
  analysisTimestamp: Date;
}

/**
 * Batch analysis result for multiple reviews
 */
export interface BatchReviewAnalysis {
  reviewIds: string[];
  overallSentiment: ReviewSentiment;
  sentimentDistribution: Record<ReviewSentiment, number>;
  commonFlags: ReviewFlagType[];
  insights: ReviewInsight[];
  averageQuality: 'low' | 'medium' | 'high';
  spamRiskLevel: 'low' | 'medium' | 'high';
  totalAnalyzed: number;
  analysisTimestamp: Date;
}

/**
 * Configuration for analysis behavior
 */
export interface AnalysisConfig {
  minReviewLength?: number; // Minimum characters for review to be considered valid
  maxReviewLength?: number; // Maximum characters
  enableSpamDetection?: boolean;
  enableFakeDetection?: boolean;
  strictMode?: boolean; // More aggressive flagging
}
