'use client';

import { Panel } from '@/app/components/ui';

type ReviewStatisticsProps = {
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
};

type StatisticBarProps = {
  label: string;
  percent: number;
  color: string;
};

function StatisticBar({ label, percent, color }: StatisticBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{Math.round(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/50">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}

export function ReviewStatistics({ positivePercent, neutralPercent, negativePercent }: ReviewStatisticsProps) {
  return (
    <Panel title="Разпределение на настроенията" description="Разпределение на клиентските мнения от отзивите">
      <div className="space-y-5">
        <StatisticBar label="Положителни" percent={positivePercent} color="bg-emerald-500" />
        <StatisticBar label="Неутрални" percent={neutralPercent} color="bg-slate-400" />
        <StatisticBar label="Отрицателни" percent={negativePercent} color="bg-red-500" />
      </div>
    </Panel>
  );
}
