type StatisticCardProps = {
  label: string;
  value: number;
  icon: string;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
};

export function StatisticCard({ label, value, icon, suffix = "", trend = "neutral", trendPercent = 0 }: StatisticCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{value}{suffix}</p>
            {trend !== "neutral" && (
              <span
                className={`text-xs font-semibold ${
                  trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend === "up" ? "↑" : "↓"} {trendPercent}%
              </span>
            )}
          </div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
