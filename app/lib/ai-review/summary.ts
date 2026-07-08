/**
 * Review Summary and Keyword Extraction
 *
 * Generates summaries of review content and extracts relevant keywords and topics.
 * Uses text analysis patterns for mock implementation.
 */

import type { ReviewSummary } from './types';

/**
 * Keywords commonly mentioned in reviews across different categories
 */
const COMMON_KEYWORDS = [
  'Комуникация',
  'Качество',
  'Цена',
  'Крайния срок',
  'Професионализъм',
  'Почистване',
  'Гаранция',
  'Своевременност',
  'Услуга',
  'Изделийство',
  'Надежност',
  'Отзивчивост',
  'Стойност',
  'Внимание към детайлите',
  'Решаване на проблеми',
];

/**
 * Topics that indicate main themes in reviews
 */
const TOPIC_KEYWORDS: Record<string, string[]> = {
  Комуникация: [
    'communication',
    'contact',
    'responded',
    'reply',
    'message',
    'called',
    'responsive',
    'prompt',
  ],
  Качество: [
    'quality',
    'workmanship',
    'craftsmanship',
    'finish',
    'detail',
    'excellent',
    'professional',
    'neat',
    'clean',
  ],
  Цена: [
    'price',
    'cost',
    'expensive',
    'affordable',
    'overpriced',
    'money',
    'value',
    'worth',
    'charge',
    'rate',
  ],
  'Крайния срок': [
    'deadline',
    'on time',
    'delay',
    'delayed',
    'late',
    'quickly',
    'fast',
    'slow',
    'schedule',
    'finished',
  ],
  Професионализъм: [
    'professional',
    'professionalism',
    'courteous',
    'polite',
    'respectful',
    'rude',
    'unprofessional',
  ],
  Надежност: [
    'reliable',
    'trustworthy',
    'dependable',
    'trust',
    'unreliable',
    'undependable',
    'consistent',
  ],
  Гаранция: ['warranty', 'guarantee', 'protected', 'covered', 'repair'],
  Своевременност: [
    'timely',
    'punctual',
    'prompt',
    'delayed',
    'dragging',
    'slow',
    'quick',
  ],
  Услуга: ['service', 'customer service', 'support', 'help', 'assistance'],
  Почистване: ['clean', 'dirty', 'tidy', 'messy', 'cleanliness', 'organized'],
};

/**
 * Extract keywords from review text based on common terminology
 *
 * @param text - The review text to analyze
 * @param maxKeywords - Maximum number of keywords to return (default: 5)
 * @returns Array of extracted keywords
 *
 * @example
 * const keywords = extractKeywords("Excellent communication and quality work");
 * // Returns: ['Communication', 'Quality']
 */
export function extractKeywords(text: string, maxKeywords = 5): string[] {
  const lowerText = text.toLowerCase();
  const foundKeywords: { keyword: string; count: number; score: number }[] = [];

  // Check each keyword
  COMMON_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
    const matches = lowerText.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      // Keywords mentioned more frequently or at the start get higher scores
      const firstMentionIndex = lowerText.indexOf(keyword.toLowerCase());
      const positionScore = firstMentionIndex < 50 ? 2 : 1; // Early mentions score higher
      const score = count * positionScore;

      foundKeywords.push({
        keyword,
        count,
        score,
      });
    }
  });

  // Sort by score (highest first) and return top keywords
  return foundKeywords
    .sort((a, b) => b.score - a.score)
    .slice(0, maxKeywords)
    .map((k) => k.keyword);
}

/**
 * Extract main topics from review text
 *
 * @param text - The review text to analyze
 * @returns Array of detected topics
 *
 * @example
 * const topics = extractMainTopics("Great service but expensive");
 * // Returns: ['Service', 'Price']
 */
export function extractMainTopics(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detectedTopics: { topic: string; score: number }[] = [];

  Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
    let score = 0;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    if (score > 0) {
      detectedTopics.push({ topic, score });
    }
  });

  // Sort by score and return top topics
  return detectedTopics
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((t) => t.topic);
}

/**
 * Generate a human-readable summary of review content
 *
 * @param reviews - Array of review texts to summarize
 * @param maxLength - Maximum length of summary (default: 200)
 * @returns Generated summary text
 *
 * @example
 * const summary = generateSummary([
 *   "Excellent communication and workmanship",
 *   "Great service but delayed",
 *   "Professional team, highly recommend"
 * ]);
 * // Returns: "Customers praise the company's communication and workmanship. ..."
 */
export function generateSummary(reviews: string[], maxLength = 200): string {
  if (reviews.length === 0) {
    return 'No reviews to summarize.';
  }

  // Analyze all reviews
  const allKeywords: Record<string, number> = {};
  const allTopics: Record<string, number> = {};
  let positiveCount = 0;
  let negativeCount = 0;

  reviews.forEach((review) => {
    // Count positive and negative indicators
    const positiveWords = [
      'excellent',
      'great',
      'good',
      'amazing',
      'perfect',
      'professional',
      'recommend',
    ];
    const negativeWords = [
      'bad',
      'poor',
      'delayed',
      'expensive',
      'disappointing',
      'unprofessional',
    ];

    positiveCount += positiveWords.filter((w) =>
      review.toLowerCase().includes(w),
    ).length;
    negativeCount += negativeWords.filter((w) =>
      review.toLowerCase().includes(w),
    ).length;

    // Extract keywords
    const keywords = extractKeywords(review, 10);
    keywords.forEach((k) => {
      allKeywords[k] = (allKeywords[k] || 0) + 1;
    });

    // Extract topics
    const topics = extractMainTopics(review);
    topics.forEach((t) => {
      allTopics[t] = (allTopics[t] || 0) + 1;
    });
  });

  // Build summary
  const summaryParts: string[] = [];

  // Overall sentiment intro
  if (positiveCount > negativeCount * 1.5) {
    summaryParts.push(
      `The majority of customers have ${positiveCount > negativeCount * 3 ? 'very ' : ''}positive experiences with this company.`,
    );
  } else if (negativeCount > positiveCount * 1.5) {
    summaryParts.push(
      `Customers have mixed to ${negativeCount > positiveCount * 3 ? 'predominantly ' : ''}negative experiences.`,
    );
  } else {
    summaryParts.push(
      'Customers have mixed experiences with this company.',
    );
  }

  // Keyword-based insights
  const topKeywords = Object.entries(allKeywords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k.toLowerCase());

  if (topKeywords.length > 0) {
    const praisedTopics = topKeywords.slice(0, 2).join(' and ');
    summaryParts.push(
      `Key strengths mentioned include ${praisedTopics}.`,
    );
  }

  // Topic-specific issues
  const topTopics = Object.entries(allTopics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);

  if (topTopics.includes('Deadline') && negativeCount > 0) {
    summaryParts.push('Several reviews mention concerns about timeliness.');
  }

  if (topTopics.includes('Price') && negativeCount > 0) {
    summaryParts.push(
      'Some customers note that pricing is a concern.',
    );
  }

  if (topTopics.includes('Communication') && positiveCount > 0) {
    summaryParts.push(
      'Customers consistently praise communication responsiveness.',
    );
  }

  // Combine and truncate
  let summary = summaryParts.join(' ');
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength).trim() + '...';
  }

  return summary;
}

/**
 * Generate a summary object with keywords and topics
 *
 * @param reviews - Array of review texts
 * @param summaryLength - Maximum length of summary text
 * @returns ReviewSummary object with text, keywords, and topics
 *
 * @example
 * const summary = generateReviewSummary(reviewTexts);
 * // Returns: { text: "...", keywords: [...], mainTopics: [...] }
 */
export function generateReviewSummary(
  reviews: string[],
  summaryLength = 200,
): ReviewSummary {
  // Generate main summary text
  const text = generateSummary(reviews, summaryLength);

  // Extract all keywords from all reviews
  const allKeywords = new Set<string>();
  reviews.forEach((review) => {
    extractKeywords(review, 5).forEach((k) => allKeywords.add(k));
  });

  // Extract all main topics
  const allTopics = new Set<string>();
  reviews.forEach((review) => {
    extractMainTopics(review).forEach((t) => allTopics.add(t));
  });

  return {
    text,
    keywords: Array.from(allKeywords).slice(0, 10),
    mainTopics: Array.from(allTopics).slice(0, 8),
  };
}

/**
 * Analyze sentiment distribution across reviews
 *
 * @param reviews - Array of review texts
 * @returns Object with sentiment counts
 *
 * @example
 * const distribution = analyzeSentimentDistribution(reviews);
 * // Returns: { positive: 45, negative: 10, neutral: 5 }
 */
export function analyzeSentimentDistribution(
  reviews: string[],
): { positive: number; negative: number; neutral: number } {
  let positive = 0;
  let negative = 0;
  let neutral = 0;

  reviews.forEach((review) => {
    const lowerText = review.toLowerCase();

    // Simple positive indicator check
    const positiveIndicators = [
      'excellent',
      'great',
      'good',
      'amazing',
      'perfect',
      'professional',
      'satisfied',
      'happy',
    ];
    const negativeIndicators = [
      'bad',
      'poor',
      'disappointing',
      'delayed',
      'unprofessional',
      'frustrated',
    ];

    const hasPositive = positiveIndicators.some((w) =>
      lowerText.includes(w),
    );
    const hasNegative = negativeIndicators.some((w) =>
      lowerText.includes(w),
    );

    if (hasPositive && !hasNegative) {
      positive++;
    } else if (hasNegative && !hasPositive) {
      negative++;
    } else {
      neutral++;
    }
  });

  return { positive, negative, neutral };
}
