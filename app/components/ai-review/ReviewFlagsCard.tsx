'use client';

import type { ReviewFlag } from '@/app/lib/ai-review/types';
import { Panel } from '@/app/components/ui';

type ReviewFlagsCardProps = {
  flags: ReviewFlag[];
};

const flagLabels: Record<string, string> = {
  spam_risk: '🚨 Риск от спам',
  fake_review_risk: '⚠️ Риск от фалшив отзив',
  duplicate_content: '🔄 Дублиран съдържание',
  personal_information: '🔒 Лична информация',
  aggressive_language: '😠 Агресивен език',
  advertisement: '📢 Реклама',
  very_short_review: '📝 Много кратък отзив',
  suspicious_pattern: '🔍 Подозрителен модел',
};

const severityConfig: Record<string, { bgColor: string; textColor: string; borderColor: string }> = {
  high: {
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  medium: {
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  low: {
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
};

export function ReviewFlagsCard({ flags }: ReviewFlagsCardProps) {
  if (!flags || flags.length === 0) {
    return null;
  }

  return (
    <Panel title="Показатели за качество" description="Проблеми открити при анализ на отзивите">
      <div className="space-y-3">
        {flags.map((flag) => {
          const config = severityConfig[flag.severity];
          return (
            <div
              key={flag.type}
              className={`rounded-[12px] border p-4 ${config.borderColor} ${config.bgColor} ${config.textColor}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{flagLabels[flag.type] || flag.type}</p>
                  <p className="mt-1 text-sm opacity-90">{flag.description}</p>
                </div>
                <span className="whitespace-nowrap text-xs font-medium uppercase opacity-75">{flag.severity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
