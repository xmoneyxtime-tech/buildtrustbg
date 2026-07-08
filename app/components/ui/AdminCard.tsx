type AdminCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: "orange" | "blue" | "green" | "red";
};

export function AdminCard({ title, value, subtitle, icon, color = "blue" }: AdminCardProps) {
  const colorClasses = {
    orange: "border-[#F58220]/20 bg-[#FFF7EE]/50",
    blue: "border-[#0F4C81]/20 bg-[#F0F4F9]/50",
    green: "border-emerald-200/80 bg-emerald-50/50",
    red: "border-red-200/80 bg-red-50/50",
  };

  const iconBgClasses = {
    orange: "bg-[#FFF7EE]",
    blue: "bg-[#F0F4F9]",
    green: "bg-emerald-100",
    red: "bg-red-100",
  };

  return (
    <div className={`rounded-[20px] border ${colorClasses[color]} p-6 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`rounded-lg ${iconBgClasses[color]} p-3 text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}
