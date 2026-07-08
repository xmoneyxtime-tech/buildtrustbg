/**
 * Review Flag Detection
 *
 * Detects potential issues, spam, and concerns in review text.
 * Identifies spam, fake reviews, personal information, aggressive language, etc.
 */

import type { ReviewFlag } from './types';

/**
 * Patterns for detecting spam
 */
const SPAM_PATTERNS = [
  /(?:click\s+here|visit\s+(?:our\s+)?site|contact\s+us|call\s+now|buy\s+now|order\s+now|shop\s+now)/i,
  /(?:http|https|www)\./i,
  /(?:follow\s+(?:us|me)|subscribe|like\s+(?:us|me)|share)/i,
  /\b(?:FREE|DISCOUNT|SALE|LIMITED\s+TIME)\b/i,
];

/**
 * Patterns for detecting fake reviews
 */
const FAKE_REVIEW_PATTERNS = [
  /i\s+(?:got|received|was\s+given)\s+(?:this\s+)?(?:for\s+)?free/i,
  /(?:affiliate|referral|commission)/i,
  /(?:not\s+verified|haven't\s+(?:used|tried))/i,
  /(?:based\s+on\s+(?:other\s+)?reviews?|heard\s+from|my\s+friend)/i,
];

/**
 * Patterns for personal information
 */
const PERSONAL_INFO_PATTERNS = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone number
  /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/, // Email
  /\b\d{4}\s+\d{4}\s+\d{4}\s+\d{4}\b/, // Credit card
  /(?:address|street|city|zip|postal)\s*:?\s+(?:[A-Z][a-z]+\s+)+\d+/i,
];

/**
 * Aggressive language patterns
 */
const AGGRESSIVE_PATTERNS = [
  /\b(?:scam|fraud|cheating|rip-?off|stealing|thief|criminal)\b/i,
  /(?:!!!|!!|\?\?|\?!)/,
  /\b(?:HATE|NEVER|WORST|AVOID|WARNING|REPORT)\b/i,
  /\b(?:should\s+(?:be|have\s+been)\s+(?:arrested|imprisoned|sued|prosecuted))\b/i,
];

/**
 * Advertisement patterns
 */
const ADVERTISEMENT_PATTERNS = [
  /(?:my\s+)?(?:business|company|website|product|service)\s+(?:is|was)\s+(?:great|amazing|best)/i,
  /(?:check\s+out|try|buy|order)\s+(?:my|our)\s+(?:product|service)/i,
  /\b(?:coupon|discount|special\s+offer)\s+(?:code|available)\b/i,
];

/**
 * Duplicate content indicators
 */
const DUPLICATE_PATTERNS = [
  /([a-z\s])\1{4,}/, // Repeated characters more than 4 times
  /\b(?:same\s+as|just\s+like|identical\s+to|copy\s+of)\b/i,
];

/**
 * Detect spam risk in review
 *
 * @param text - The review text
 * @returns Flag object if spam detected, null otherwise
 *
 * @example
 * const flag = detectSpam("Click here to visit our site!");
 * // Returns flag with type 'spam_risk'
 */
export function detectSpam(text: string): ReviewFlag | null {
  let matchCount = 0;

  SPAM_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      matchCount++;
    }
  });

  if (matchCount >= 2) {
    return {
      type: 'spam_risk',
      description:
        'Review contains multiple spam indicators (links, promotional language, calls to action)',
      severity: 'high',
      confidence: 'high',
    };
  }

  if (matchCount === 1) {
    return {
      type: 'spam_risk',
      description: 'Review contains potential spam indicators',
      severity: 'medium',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect fake review risk
 *
 * @param text - The review text
 * @returns Flag object if fake review risk detected, null otherwise
 *
 * @example
 * const flag = detectFakeReview("I heard from my friend this product is amazing");
 * // Returns flag with type 'fake_review_risk'
 */
export function detectFakeReview(text: string): ReviewFlag | null {
  let matchCount = 0;

  FAKE_REVIEW_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      matchCount++;
    }
  });

  if (matchCount >= 2) {
    return {
      type: 'fake_review_risk',
      description:
        'Review shows patterns commonly found in fake or unverified reviews',
      severity: 'high',
      confidence: 'high',
    };
  }

  if (matchCount === 1) {
    return {
      type: 'fake_review_risk',
      description:
        'Review may not be from a verified customer based on language patterns',
      severity: 'medium',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect personal information in review
 *
 * @param text - The review text
 * @returns Flag object if personal information detected, null otherwise
 *
 * @example
 * const flag = detectPersonalInfo("Call me at 555-123-4567 for details");
 * // Returns flag with type 'personal_information'
 */
export function detectPersonalInfo(text: string): ReviewFlag | null {
  let matchCount = 0;

  PERSONAL_INFO_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      matchCount++;
    }
  });

  if (matchCount > 0) {
    return {
      type: 'personal_information',
      description:
        'Review contains personal information (phone, email, address, etc.) that should be redacted for privacy',
      severity: 'high',
      confidence: 'high',
    };
  }

  return null;
}

/**
 * Detect aggressive or offensive language
 *
 * @param text - The review text
 * @returns Flag object if aggressive language detected, null otherwise
 *
 * @example
 * const flag = detectAggressiveLanguage("This company is a SCAM!!!");
 * // Returns flag with type 'aggressive_language'
 */
export function detectAggressiveLanguage(text: string): ReviewFlag | null {
  let matchCount = 0;

  AGGRESSIVE_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      matchCount++;
    }
  });

  if (matchCount >= 2) {
    return {
      type: 'aggressive_language',
      description:
        'Review contains aggressive language, excessive punctuation, or offensive content',
      severity: 'high',
      confidence: 'high',
    };
  }

  if (matchCount === 1) {
    return {
      type: 'aggressive_language',
      description: 'Review contains some aggressive or heated language',
      severity: 'medium',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect potential advertisements within review
 *
 * @param text - The review text
 * @returns Flag object if advertisement detected, null otherwise
 *
 * @example
 * const flag = detectAdvertisement("Try my new product, it's the best!");
 * // Returns flag with type 'advertisement'
 */
export function detectAdvertisement(text: string): ReviewFlag | null {
  let matchCount = 0;

  ADVERTISEMENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      matchCount++;
    }
  });

  if (matchCount >= 2) {
    return {
      type: 'advertisement',
      description:
        'Review appears to be promoting a product or service rather than sharing genuine feedback',
      severity: 'high',
      confidence: 'high',
    };
  }

  if (matchCount === 1) {
    return {
      type: 'advertisement',
      description: 'Review may contain promotional content',
      severity: 'medium',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect duplicate content patterns
 *
 * @param text - The review text
 * @returns Flag object if duplicate content detected, null otherwise
 *
 * @example
 * const flag = detectDuplicateContent("This is the besssssst service ever");
 * // Returns flag with type 'duplicate_content'
 */
export function detectDuplicateContent(text: string): ReviewFlag | null {
  if (DUPLICATE_PATTERNS[0].test(text)) {
    return {
      type: 'duplicate_content',
      description:
        'Review contains unusual repeated characters or suspicious patterns',
      severity: 'medium',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect very short reviews (potentially low quality)
 *
 * @param text - The review text
 * @returns Flag object if review is very short, null otherwise
 *
 * @example
 * const flag = detectVeryShortReview("Good");
 * // Returns flag with type 'very_short_review'
 */
export function detectVeryShortReview(text: string): ReviewFlag | null {
  const wordCount = text.trim().split(/\s+/).length;

  if (wordCount < 5) {
    return {
      type: 'very_short_review',
      description:
        'Review is very short and lacks detailed information about the service',
      severity: 'low',
      confidence: 'high',
    };
  }

  return null;
}

/**
 * Detect suspicious patterns (e.g., unusual timing, patterns)
 *
 * @param text - The review text
 * @param reviewCount - Number of reviews from same user (optional)
 * @param daysOld - How many days old is the review (optional)
 * @returns Flag object if suspicious pattern detected, null otherwise
 *
 * @example
 * const flag = detectSuspiciousPattern(text, 50, 1);
 * // Returns flag if user posted 50 reviews in 1 day
 */
export function detectSuspiciousPattern(
  text: string,
  reviewCount?: number,
  daysOld?: number,
): ReviewFlag | null {
  // Check for extreme review frequency (many reviews in short time)
  if (reviewCount && daysOld) {
    const reviewsPerDay = reviewCount / Math.max(daysOld, 1);
    if (reviewsPerDay > 10) {
      return {
        type: 'suspicious_pattern',
        description:
          'Suspicious posting pattern detected (unusually high review frequency from this user)',
        severity: 'high',
        confidence: 'high',
      };
    }
  }

  // Check for unusual text patterns
  if (text.length > 5000) {
    return {
      type: 'suspicious_pattern',
      description:
        'Review is unusually long, which may indicate automated or copied content',
      severity: 'low',
      confidence: 'medium',
    };
  }

  return null;
}

/**
 * Detect all applicable flags for a review
 *
 * @param text - The review text
 * @param options - Optional configuration (reviewCount, daysOld)
 * @returns Array of detected flags
 *
 * @example
 * const flags = detectAllFlags("Click here for free stuff!");
 * // Returns array of all detected flags
 */
export function detectAllFlags(
  text: string,
  options?: {
    reviewCount?: number;
    daysOld?: number;
  },
): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  // Run all detectors
  const detectors = [
    detectSpam(text),
    detectFakeReview(text),
    detectPersonalInfo(text),
    detectAggressiveLanguage(text),
    detectAdvertisement(text),
    detectDuplicateContent(text),
    detectVeryShortReview(text),
    detectSuspiciousPattern(text, options?.reviewCount, options?.daysOld),
  ];

  // Collect non-null flags
  detectors.forEach((flag) => {
    if (flag) {
      flags.push(flag);
    }
  });

  return flags;
}

/**
 * Check if review should be marked as spam
 *
 * @param flags - Array of detected flags
 * @returns True if review has high-severity spam indicators
 *
 * @example
 * const isSpam = isSpamLikely(flags);
 */
export function isSpamLikely(flags: ReviewFlag[]): boolean {
  return flags.some(
    (f) =>
      (f.type === 'spam_risk' || f.type === 'advertisement') &&
      f.severity === 'high',
  );
}

/**
 * Check if review is likely fake
 *
 * @param flags - Array of detected flags
 * @returns True if review has high-severity fake indicators
 *
 * @example
 * const isFake = isFakeLikely(flags);
 */
export function isFakeLikely(flags: ReviewFlag[]): boolean {
  const fakeFlags = flags.filter(
    (f) =>
      f.type === 'fake_review_risk' && (f.severity === 'high' || f.severity === 'medium'),
  );
  return fakeFlags.length > 0;
}

/**
 * Get quality rating based on flags
 *
 * @param flags - Array of detected flags
 * @returns Quality level ('high', 'medium', or 'low')
 *
 * @example
 * const quality = getQualityFromFlags(flags);
 */
export function getQualityFromFlags(
  flags: ReviewFlag[],
): 'low' | 'medium' | 'high' {
  const highSeverityFlags = flags.filter((f) => f.severity === 'high').length;
  const mediumSeverityFlags = flags.filter((f) => f.severity === 'medium')
    .length;

  if (highSeverityFlags >= 2) {
    return 'low';
  }
  if (highSeverityFlags === 1 || mediumSeverityFlags >= 2) {
    return 'medium';
  }
  return 'high';
}
