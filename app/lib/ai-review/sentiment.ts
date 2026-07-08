/**
 * Review Sentiment Analysis
 *
 * Analyzes the sentiment of review text by detecting positive, negative, and neutral language.
 * Uses keyword matching and text analysis patterns for mock implementation.
 */

import type {
  ReviewSentiment,
  ReviewSentimentAnalysis,
  AIConfidence,
} from './types';

/**
 * Positive sentiment keywords
 */
const POSITIVE_KEYWORDS = [
  'excellent',
  'great',
  'amazing',
  'perfect',
  'wonderful',
  'outstanding',
  'fantastic',
  'good',
  'nice',
  'excellent',
  'superb',
  'best',
  'highly recommend',
  'satisfied',
  'happy',
  'impressed',
  'professional',
  'quality',
  'efficient',
  'responsive',
  'knowledgeable',
  'friendly',
  'reliable',
  'punctual',
  'trustworthy',
  'beautiful',
  'clean',
  'fast',
  'quick',
  'smooth',
  'easy',
  'love',
  'awesome',
  'brilliant',
  'recommend',
  'brilliant',
];

/**
 * Negative sentiment keywords
 */
const NEGATIVE_KEYWORDS = [
  'terrible',
  'awful',
  'horrible',
  'bad',
  'poor',
  'worst',
  'disappointing',
  'disappointed',
  'useless',
  'waste',
  'never',
  'avoid',
  'unprofessional',
  'rude',
  'incompetent',
  'slow',
  'delayed',
  'broken',
  'damaged',
  'wrong',
  'incomplete',
  'frustrated',
  'angry',
  'upset',
  'disgusted',
  'scam',
  'fraud',
  'expensive',
  'overpriced',
  'worst',
  'hate',
  'terrible',
  'don\'t recommend',
  'regret',
];

/**
 * Very positive intensifiers
 */
const VERY_POSITIVE_INTENSIFIERS = [
  'absolutely',
  'definitely',
  'truly',
  'really',
  'very',
  'extremely',
  'incredibly',
  'exceptionally',
  '5 stars',
  'perfect',
  'excellent',
  'outstanding',
];

/**
 * Very negative intensifiers
 */
const VERY_NEGATIVE_INTENSIFIERS = [
  'absolutely',
  'definitely',
  'never',
  'worst',
  'terrible',
  'horrible',
  'completely',
  'totally',
  'extremely',
  'utterly',
  '1 star',
  '0 stars',
];

/**
 * Analyze sentiment of review text
 *
 * @param text - The review text to analyze
 * @returns Sentiment analysis result with sentiment type, confidence, and score
 *
 * @example
 * const analysis = analyzeSentiment("This service was absolutely excellent!");
 * // Returns: { sentiment: 'very_positive', confidence: 'high', score: 0.95 }
 */
export function analyzeSentiment(text: string): ReviewSentimentAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      sentiment: 'neutral',
      confidence: 'high',
      score: 0,
    };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  // Count keyword occurrences
  let positiveCount = 0;
  let negativeCount = 0;
  let hasIntensifier = false;
  let isVeryPositive = false;
  let isVeryNegative = false;

  words.forEach((word) => {
    // Check for intensifiers first
    if (VERY_POSITIVE_INTENSIFIERS.some((k) => word.includes(k))) {
      isVeryPositive = true;
      hasIntensifier = true;
    }
    if (VERY_NEGATIVE_INTENSIFIERS.some((k) => word.includes(k))) {
      isVeryNegative = true;
      hasIntensifier = true;
    }

    // Count positive/negative keywords
    if (POSITIVE_KEYWORDS.some((k) => word.includes(k))) {
      positiveCount++;
    }
    if (NEGATIVE_KEYWORDS.some((k) => word.includes(k))) {
      negativeCount++;
    }
  });

  // Calculate sentiment score
  const keywordBalance = positiveCount - negativeCount;
  const totalKeywords = positiveCount + negativeCount;
  const textLength = words.length;

  // Determine sentiment
  let sentiment: ReviewSentiment = 'neutral';
  let confidence: AIConfidence = 'medium';
  let score = 0;

  if (totalKeywords === 0) {
    // No keywords detected
    sentiment = 'neutral';
    confidence = 'high';
    score = 0;
  } else if (keywordBalance > 0) {
    // Positive sentiment
    const positiveRatio = positiveCount / totalKeywords;
    const intensity = positiveRatio * 2; // 0 to 2

    if (isVeryPositive || (positiveRatio > 0.8 && hasIntensifier)) {
      sentiment = 'very_positive';
      confidence = 'high';
      score = Math.min(1, 0.85 + intensity * 0.15);
    } else if (positiveRatio > 0.6) {
      sentiment = 'positive';
      confidence = 'high';
      score = Math.min(1, 0.5 + intensity * 0.35);
    } else {
      sentiment = 'positive';
      confidence = 'medium';
      score = 0.5 + positiveRatio * 0.3;
    }
  } else if (keywordBalance < 0) {
    // Negative sentiment
    const negativeRatio = negativeCount / totalKeywords;
    const intensity = negativeRatio * 2; // 0 to 2

    if (isVeryNegative || (negativeRatio > 0.8 && hasIntensifier)) {
      sentiment = 'very_negative';
      confidence = 'high';
      score = Math.max(-1, -0.85 - intensity * 0.15);
    } else if (negativeRatio > 0.6) {
      sentiment = 'negative';
      confidence = 'high';
      score = Math.max(-1, -0.5 - intensity * 0.35);
    } else {
      sentiment = 'negative';
      confidence = 'medium';
      score = -0.5 - negativeRatio * 0.3;
    }
  } else {
    // Balanced - equal positive and negative
    sentiment = 'neutral';
    confidence = 'medium';
    score = 0;
  }

  // Adjust confidence based on text length
  if (textLength < 10) {
    confidence = 'low';
  } else if (textLength > 100) {
    confidence = 'very_high';
  } else if (textLength > 50) {
    confidence = 'high';
  }

  return {
    sentiment,
    confidence,
    score: Math.round(score * 100) / 100, // Round to 2 decimals
  };
}

/**
 * Detect if sentiment is generally positive
 *
 * @param sentiment - The sentiment type to check
 * @returns True if sentiment is positive or very positive
 *
 * @example
 * isPositive('positive') // true
 * isPositive('very_positive') // true
 * isPositive('neutral') // false
 */
export function isPositive(sentiment: ReviewSentiment): boolean {
  return sentiment === 'positive' || sentiment === 'very_positive';
}

/**
 * Detect if sentiment is generally negative
 *
 * @param sentiment - The sentiment type to check
 * @returns True if sentiment is negative or very negative
 *
 * @example
 * isNegative('negative') // true
 * isNegative('very_negative') // true
 * isNegative('neutral') // false
 */
export function isNegative(sentiment: ReviewSentiment): boolean {
  return sentiment === 'negative' || sentiment === 'very_negative';
}

/**
 * Get human-readable label for sentiment
 *
 * @param sentiment - The sentiment type
 * @returns Human-readable sentiment label in English
 *
 * @example
 * getSentimentLabel('very_positive') // "Very Positive"
 */
export function getSentimentLabel(sentiment: ReviewSentiment): string {
  const labels: Record<ReviewSentiment, string> = {
    very_positive: 'Very Positive',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    very_negative: 'Very Negative',
  };
  return labels[sentiment];
}

/**
 * Get emoji representation of sentiment
 *
 * @param sentiment - The sentiment type
 * @returns Emoji representing the sentiment
 *
 * @example
 * getSentimentEmoji('very_positive') // "😍"
 */
export function getSentimentEmoji(sentiment: ReviewSentiment): string {
  const emojis: Record<ReviewSentiment, string> = {
    very_positive: '😍',
    positive: '😊',
    neutral: '😐',
    negative: '😕',
    very_negative: '😡',
  };
  return emojis[sentiment];
}
