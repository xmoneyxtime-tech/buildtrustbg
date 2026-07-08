'use client';

import { Panel } from '@/app/components/ui';

type AIKeywordCloudProps = {
  keywords: string[];
};

export function AIKeywordCloud({ keywords }: AIKeywordCloudProps) {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <Panel title="Основни теми" description="Най-често споменавани теми в отзивите">
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-[#0F4C81]/20 bg-[#EEF4FA] px-4 py-2 text-sm font-medium text-[#0F4C81] transition hover:border-[#0F4C81]/40 hover:bg-[#E1EBF5]"
          >
            {keyword}
          </span>
        ))}
      </div>
    </Panel>
  );
}
