interface KPICardProps {
  label: string;
  value: number | string;
  icon: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  onClick?: () => void;
}

export function KPICard({
  label,
  value,
  icon,
  subtext,
  trend = "neutral",
  trendPercent = 0,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)] transition ${
        onClick ? "cursor-pointer hover:border-[#0F4C81]/30 hover:shadow-[0_16px_40px_-20px_rgba(15,76,129,0.16)]" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{label}</p>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-bold text-slate-900">{value}</p>
            {trend !== "neutral" && (
              <span
                className={`text-sm font-semibold ${
                  trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend === "up" ? "↑" : "↓"} {trendPercent}%
              </span>
            )}
          </div>
          {subtext && <p className="mt-2 text-sm text-slate-600">{subtext}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8FAFC] text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
