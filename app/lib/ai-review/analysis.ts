/**
 * Comprehensive Review Analysis
 *
 * Main module that combines sentiment analysis, flag detection, and summary generation
 * into a complete review analysis pipeline. Generates ReviewAnalysis and BatchReviewAnalysis objects.
 */

import type {
  ReviewAnalysis,
  BatchReviewAnalysis,
  ReviewSentiment,
  ReviewInsight,
  ReviewFlagType,
  AnalysisConfig,
} from './types';
import { analyzeSentiment, isPositive, isNegative } from './sentiment';
import {
  detectAllFlags,
  isSpamLikely,
  isFakeLikely,
  getQualityFromFlags,
} from './flags';
import {
  generateReviewSummary,
} from './summary';

/**
 * Default analysis configuration
 */
const DEFAULT_CONFIG: AnalysisConfig = {
  minReviewLength: 3,
  maxReviewLength: 5000,
  enableSpamDetection: true,
  enableFakeDetection: true,
  strictMode: false,
};

/**
 * Validate review text against configuration
 *
 * @param text - The review text
 * @param config - Analysis configuration
 * @returns True if review passes validation
 *
 * @example
 * const isValid = validateReview(text, config);
 */
function validateReview(
  text: string,
  config: AnalysisConfig = DEFAULT_CONFIG,
): boolean {
  const length = text.trim().length;
  const minLength = config.minReviewLength || 3;
  const maxLength = config.maxReviewLength || 5000;

  if (length < minLength || length > maxLength) {
    return false;
  }

  return true;
}

/**
 * Analyze a single review
 *
 * Performs comprehensive analysis including:
 * - Sentiment detection
 * - Flag detection (spam, fake, personal info, aggressive language, etc.)
 * - Summary generation
 * - Overall quality assessment
 *
 * @param text - The review text to analyze
 * @param reviewId - Unique identifier for the review
 * @param config - Optional analysis configuration
 * @returns Complete review analysis
 *
 * @example
 * const analysis = analyzeReview(
 *   "Excellent service and communication!",
 *   "review-123"
 * );
 * // Returns comprehensive ReviewAnalysis object
 */
export function analyzeReview(
  text: string,
  reviewId: string,
  config: AnalysisConfig = DEFAULT_CONFIG,
): ReviewAnalysis {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Validate review
  if (!validateReview(text, mergedConfig)) {
    return {
      reviewId,
      text,
      sentiment: {
        sentiment: 'neutral',
        confidence: 'low',
        score: 0,
      },
      flags: [],
      summary: {
        text: 'Review is too short or too long.',
        keywords: [],
        mainTopics: [],
      },
      isSpamLikely: false,
      isFakeLikely: false,
      overallQuality: 'low',
      analysisTimestamp: new Date(),
    };
  }

  // Analyze sentiment
  const sentiment = analyzeSentiment(text);

  // Detect flags
  const flagsDetected = mergedConfig.enableSpamDetection
    ? detectAllFlags(text)
    : [];

  // Generate summary
  const summary = generateReviewSummary([text]);

  // Check for spam and fake
  const spam = isSpamLikely(flagsDetected);
  const fake = isFakeLikely(flagsDetected);

  // Determine quality
  const quality = getQualityFromFlags(flagsDetected);

  return {
    reviewId,
    text,
    sentiment,
    flags: flagsDetected,
    summary,
    isSpamLikely: spam,
    isFakeLikely: fake,
    overallQuality: quality,
    analysisTimestamp: new Date(),
  };
}

/**
 * Analyze multiple reviews in batch
 *
 * Analyzes a collection of reviews and generates insights across all reviews.
 * Includes:
 * - Individual review analyses
 * - Overall sentiment distribution
 * - Common flags across reviews
 * - Aggregated insights
 * - Overall quality assessment
 * - Spam risk level
 *
 * @param reviews - Array of review texts
 * @param config - Optional analysis configuration
 * @returns Batch analysis with aggregated results
 *
 * @example
 * const batchAnalysis = analyzeBatch([
 *   "Great service",
 *   "Excellent work",
 *   "Poor communication"
 * ]);
 * // Returns BatchReviewAnalysis with insights
 */
export function analyzeBatch(
  reviews: string[],
  config: AnalysisConfig = DEFAULT_CONFIG,
): BatchReviewAnalysis {
  if (reviews.length === 0) {
    return {
      reviewIds: [],
      overallSentiment: 'neutral',
      sentimentDistribution: {
        very_positive: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        very_negative: 0,
      },
      commonFlags: [],
      insights: [],
      averageQuality: 'medium',
      spamRiskLevel: 'low',
      totalAnalyzed: 0,
      analysisTimestamp: new Date(),
    };
  }

  // Analyze each review
  const analyses = reviews.map((review, index) =>
    analyzeReview(review, `review-${index}`, config),
  );

  // Aggregate results
  const sentimentDistribution: Record<ReviewSentiment, number> = {
    very_positive: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    very_negative: 0,
  };

  const flagCount: Record<string, number> = {};
  let totalQualityScore = 0;
  let spamCount = 0;

  analyses.forEach((analysis) => {
    // Count sentiments
    sentimentDistribution[analysis.sentiment.sentiment]++;

    // Count flags
    analysis.flags.forEach((flag) => {
      flagCount[flag.type] = (flagCount[flag.type] || 0) + 1;
    });

    // Track spam
    if (analysis.isSpamLikely) {
      spamCount++;
    }

    // Accumulate quality
    totalQualityScore +=
      analysis.overallQuality === 'high' ? 3 : analysis.overallQuality === 'medium' ? 2 : 1;
  });

  // Determine overall sentiment
  const positiveCount =
    sentimentDistribution.very_positive + sentimentDistribution.positive;
  const negativeCount =
    sentimentDistribution.very_negative + sentimentDistribution.negative;

  let overallSentiment: ReviewSentiment = 'neutral';
  if (positiveCount > negativeCount * 1.5) {
    overallSentiment = positiveCount > negativeCount * 3 ? 'very_positive' : 'positive';
  } else if (negativeCount > positiveCount * 1.5) {
    overallSentiment = negativeCount > positiveCount * 3 ? 'very_negative' : 'negative';
  }

  // Get most common flags
  const commonFlags = Object.entries(flagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([flag]) => flag as ReviewFlagType);

  // Calculate average quality
  const avgQualityScore = totalQualityScore / reviews.length;
  const averageQuality: 'low' | 'medium' | 'high' =
    avgQualityScore > 2.5 ? 'high' : avgQualityScore > 1.5 ? 'medium' : 'low';

  // Calculate spam risk level
  const spamRiskPercent = (spamCount / reviews.length) * 100;
  const spamRiskLevel: 'low' | 'medium' | 'high' =
    spamRiskPercent > 30 ? 'high' : spamRiskPercent > 10 ? 'medium' : 'low';

  // Generate insights from batch
  const insights = generateBatchInsights(analyses);

  return {
    reviewIds: analyses.map((a) => a.reviewId),
    overallSentiment,
    sentimentDistribution,
    commonFlags: commonFlags.slice(0, 5),
    insights,
    averageQuality,
    spamRiskLevel,
    totalAnalyzed: reviews.length,
    analysisTimestamp: new Date(),
  };
}

/**
 * Generate insights from batch analysis
 *
 * @param analyses - Array of individual review analyses
 * @returns Array of generated insights
 *
 * @example
 * const insights = generateBatchInsights(analyses);
 */
function generateBatchInsights(analyses: ReviewAnalysis[]): ReviewInsight[] {
  const insights: ReviewInsight[] = [];
  const totalReviews = analyses.length;

  // Positive experience frequency
  const positiveReviews = analyses.filter((a) => isPositive(a.sentiment.sentiment));
  if (positiveReviews.length > 0) {
    const percentage = Math.round(
      (positiveReviews.length / totalReviews) * 100,
    );
    const frequency: typeof insights[0]['frequency'] = percentage > 70 ? 'very_common' : percentage > 40 ? 'common' : 'occasional';
    insights.push({
      title: `${percentage}% положителни впечатления от клиенти`,
      description: `Мнозинството от клиентите имат положителна обратна информация за тази компания.`,
      frequency,
      sentiment: 'positive' as ReviewSentiment,
      supportingCount: positiveReviews.length,
    });
  }

  // Negative experience frequency
  const negativeReviews = analyses.filter((a) => isNegative(a.sentiment.sentiment));
  if (negativeReviews.length > 0) {
    const percentage = Math.round(
      (negativeReviews.length / totalReviews) * 100,
    );
    const frequency: typeof insights[0]['frequency'] = percentage > 30 ? 'common' : 'occasional';
    insights.push({
      title: `${percentage}% клиенти докладват проблеми`,
      description: `Някои клиенти са докладвали проблеми или опасения.`,
      frequency,
      sentiment: 'negative' as ReviewSentiment,
      supportingCount: negativeReviews.length,
    });
  }

  // Common keywords from positive reviews
  const positiveKeywords = new Map<string, number>();
  positiveReviews.forEach((review) => {
    review.summary.keywords.forEach((keyword) => {
      positiveKeywords.set(
        keyword,
        (positiveKeywords.get(keyword) || 0) + 1,
      );
    });
  });

  if (positiveKeywords.size > 0) {
    const topKeyword = Array.from(positiveKeywords.entries()).sort(
      ([, a], [, b]) => b - a,
    )[0];
    insights.push({
      title: `${topKeyword[0]} често се похвала`,
      description: `Клиентите често споменават "${topKeyword[0].toLowerCase()}" положително.`,
      frequency: 'common' as const,
      sentiment: 'very_positive' as ReviewSentiment,
      supportingCount: topKeyword[1],
    });
  }

  // Recurring complaints
  const negativeTopics = new Map<string, number>();
  negativeReviews.forEach((review) => {
    review.summary.mainTopics.forEach((topic) => {
      negativeTopics.set(topic, (negativeTopics.get(topic) || 0) + 1);
    });
  });

  if (negativeTopics.size > 0) {
    const topComplaint = Array.from(negativeTopics.entries()).sort(
      ([, a], [, b]) => b - a,
    )[0];
    insights.push({
      title: `Повтарящи се жалби относно ${topComplaint[0].toLowerCase()}`,
      description: `Множество клиенти споменават проблеми с ${topComplaint[0].toLowerCase()}.`,
      frequency: 'common' as const,
      sentiment: 'negative' as ReviewSentiment,
      supportingCount: topComplaint[1],
    });
  }

  // High quality reviews
  const highQualityReviews = analyses.filter(
    (a) => a.overallQuality === 'high',
  ).length;
  if (highQualityReviews / totalReviews > 0.7) {
    insights.push({
      title: 'Подробни и достоверни отзиви',
      description: 'Повечето отзиви изглеждат автентични и детайлни.',
      frequency: 'very_common' as const,
      sentiment: 'positive' as ReviewSentiment,
      supportingCount: highQualityReviews,
    });
  }

  // Spam or fake review warnings
  const spamReviews = analyses.filter((a) => a.isSpamLikely).length;
  if (spamReviews > 0) {
    const percentage = Math.round((spamReviews / totalReviews) * 100);
    const frequency: typeof insights[0]['frequency'] = percentage > 10 ? 'common' : 'occasional';
    insights.push({
      title: `${percentage}% потенциален спам/фалшиви отзиви`,
      description: 'Няколко отзива показват модели, съответстващи на спам или неавтентично съдържание.',
      frequency,
      sentiment: 'neutral' as ReviewSentiment,
      supportingCount: spamReviews,
    });
  }

  return insights;
}

/**
 * Quick analysis function for simple use cases
 *
 * Analyzes a review with minimal configuration, returning just the essentials.
 * Useful for quick assessments.
 *
 * @param text - The review text
 * @param reviewId - Optional review ID
 * @returns Simplified ReviewAnalysis object
 *
 * @example
 * const quick = quickAnalyze("Great service!");
 */
export function quickAnalyze(text: string, reviewId = 'quick-review') {
  const config: AnalysisConfig = {
    minReviewLength: 1,
    enableSpamDetection: true,
    enableFakeDetection: false,
    strictMode: false,
  };

  return analyzeReview(text, reviewId, config);
}

/**
 * Get human-readable quality label
 *
 * @param quality - The quality level
 * @returns Human-readable label
 *
 * @example
 * getQualityLabel('high') // "High Quality Review"
 */
export function getQualityLabel(
  quality: 'low' | 'medium' | 'high',
): string {
  const labels = {
    high: 'High Quality Review',
    medium: 'Moderate Quality Review',
    low: 'Low Quality Review',
  };
  return labels[quality];
}

/**
 * Get overall risk assessment
 *
 * Combines spam, fake, and quality information into a risk level.
 *
 * @param analysis - ReviewAnalysis object
 * @returns Risk level ('low', 'medium', 'high')
 *
 * @example
 * const risk = getOverallRisk(analysis);
 */
export function getOverallRisk(analysis: ReviewAnalysis): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  if (analysis.isSpamLikely) riskScore += 3;
  if (analysis.isFakeLikely) riskScore += 3;
  if (analysis.overallQuality === 'low') riskScore += 2;
  if (analysis.flags.length > 3) riskScore += 1;

  if (riskScore >= 5) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}
