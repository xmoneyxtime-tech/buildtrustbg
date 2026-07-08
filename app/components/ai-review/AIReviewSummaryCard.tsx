'use client';

import { Panel } from '@/app/components/ui';

type AIReviewSummaryCardProps = {
  summary: string;
};

export function AIReviewSummaryCard({ summary }: AIReviewSummaryCardProps) {
  return (
    <Panel title="🤖 AI Обобщение" description="Интелигентен анализ на мнения от клиенти">
      <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">{summary}</p>
    </Panel>
  );
}
