'use client';

import type { ReviewInsight } from '@/app/lib/ai-review/types';
import { AISentimentBadge } from './AISentimentBadge';

type AIInsightCardProps = {
  insight: ReviewInsight;
};

const frequencyIcons: Record<ReviewInsight['frequency'], string> = {
  rare: '•',
  occasional: '••',
  common: '•••',
  very_common: '••••',
};

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className="rounded-[16px] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{insight.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">{insight.description}</p>
          {insight.supportingCount !== undefined && (
            <p className="mt-2 text-xs text-slate-600">Споменато в {insight.supportingCount} отзива</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-600">{frequencyIcons[insight.frequency]}</span>
          <AISentimentBadge sentiment={insight.sentiment} />
        </div>
      </div>
    </div>
  );
}
