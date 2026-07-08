'use client';

import type { ReviewSentiment } from '@/app/lib/ai-review/types';

type AISentimentBadgeProps = {
  sentiment: ReviewSentiment;
  score?: number;
};

const sentimentConfig: Record<ReviewSentiment, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
  very_positive: {
    label: 'Много положително',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  positive: {
    label: 'Положително',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  neutral: {
    label: 'Неутрално',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
  negative: {
    label: 'Отрицателно',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  very_negative: {
    label: 'Много отрицателно',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

export function AISentimentBadge({ sentiment, score }: AISentimentBadgeProps) {
  const config = sentimentConfig[sentiment];

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium ${config.borderColor} ${config.bgColor} ${config.textColor}`}>
      {config.label}
      {score !== undefined && <span className="ml-2 font-semibold">({Math.round(score * 100)}%)</span>}
    </span>
  );
}
