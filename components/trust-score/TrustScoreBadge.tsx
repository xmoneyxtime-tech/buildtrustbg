import type { TrustLevel } from "@/app/lib/trust-score";

type TrustScoreBadgeProps = {
  level: TrustLevel;
};

const levelStyles: Record<TrustLevel, string> = {
  Bronze: "bg-amber-100 text-amber-800",
  Silver: "bg-slate-100 text-slate-800",
  Gold: "bg-yellow-100 text-yellow-800",
  Platinum: "bg-cyan-100 text-cyan-800",
  Legendary: "bg-purple-100 text-purple-800",
  Excellent: "bg-green-100 text-green-800",
  "Very Good": "bg-emerald-100 text-emerald-800",
  Good: "bg-blue-100 text-blue-800",
  Fair: "bg-orange-100 text-orange-800",
  Weak: "bg-red-100 text-red-800",
  Poor: "bg-rose-100 text-rose-800",
};

export function TrustScoreBadge({ level }: TrustScoreBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${levelStyles[level]}`}>
      {level}
    </span>
  );
}
