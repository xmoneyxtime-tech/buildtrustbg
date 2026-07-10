import type { TrustScoreResult } from "@/app/lib/trust-score";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { TrustProgressBar } from "./TrustProgressBar";

type TrustScoreCardProps = {
  result: TrustScoreResult;
  title?: string;
};

export function TrustScoreCard({ result, title = "BuildTrust Score" }: TrustScoreCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <TrustScoreBadge level={result.level} />
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-4xl font-bold tracking-tight text-slate-900">{result.score}</span>
        <span className="pb-1 text-sm text-slate-500">/ 100</span>
      </div>

      <div className="mt-4">
        <TrustProgressBar score={result.score} />
      </div>

      <p className="mt-3 text-sm text-slate-600">
        Profile completeness: {result.profileCompleteness}%
      </p>
    </div>
  );
}
