type StatusBadgeProps = {
  variant: "warning" | "info" | "success" | "neutral";
  children: React.ReactNode;
};

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const variants = {
    warning: "border-[#F58220]/20 bg-[#FFF7EE] text-[#C25A00]",
    info: "border-[#0F4C81]/20 bg-[#EEF4FA] text-[#0F4C81]",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${variants[variant]}`}>{children}</span>;
}
