import type { TrustBreakdownItem, TrustSuggestion } from "@/app/lib/trust-score";

type TrustBreakdownProps = {
  breakdown: TrustBreakdownItem[];
  suggestions?: TrustSuggestion[];
};

export function TrustBreakdown({ breakdown, suggestions = [] }: TrustBreakdownProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-900">Trust Breakdown</h3>
        <ul className="mt-4 space-y-2">
          {breakdown.map((item) => (
            <li key={item.key} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{item.label}</span>
              <span className={item.earned ? "font-semibold text-green-700" : "font-semibold text-slate-500"}>
                +{item.points}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">Suggestions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {suggestions.slice(0, 6).map((item) => (
              <li key={item.key}>- {item.label} (+{item.missingPoints})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
