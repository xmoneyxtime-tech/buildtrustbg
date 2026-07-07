type StatsCardProps = {
  value: string;
  label: string;
};

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-200/70 bg-white p-6 text-center shadow-[0_18px_45px_-24px_rgba(15,76,129,0.25)]">
      <div className="text-3xl font-semibold text-[#0F4C81]">{value}</div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
