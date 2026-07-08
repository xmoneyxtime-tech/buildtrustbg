'use client';

import { Panel } from '@/app/components/ui';

type AIRecommendationCardProps = {
  recommendation: string;
  overallQuality: 'low' | 'medium' | 'high';
};

const qualityConfig: Record<string, { icon: string; label: string; bgColor: string; textColor: string; borderColor: string }> = {
  high: {
    icon: '⭐',
    label: 'Силно препоръчвано',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  medium: {
    icon: '👍',
    label: 'Препоръчвано',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  low: {
    icon: '⚠️',
    label: 'Да се използва с внимание',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
};

export function AIRecommendationCard({ recommendation, overallQuality }: AIRecommendationCardProps) {
  const config = qualityConfig[overallQuality];

  return (
    <Panel>
      <div className={`rounded-[16px] border p-6 ${config.borderColor} ${config.bgColor}`}>
        <div className="flex items-start gap-4">
          <span className="text-3xl">{config.icon}</span>
          <div className="flex-1">
            <p className={`text-lg font-semibold ${config.textColor}`}>{config.label}</p>
            <p className="mt-3 leading-7 text-slate-700">{recommendation}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
