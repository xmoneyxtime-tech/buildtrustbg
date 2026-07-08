type AdminBadgeProps = {
  variant: "pending" | "approved" | "rejected" | "gold" | "premium" | "featured" | "none";
  label: string;
};

export function AdminBadge({ variant, label }: AdminBadgeProps) {
  const styles = {
    pending: "border-[#F58220]/30 bg-[#FFF7EE] text-[#F58220]",
    approved: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200/80 bg-red-50 text-red-700",
    gold: "border-yellow-300/80 bg-yellow-50 text-yellow-700",
    premium: "border-purple-200/80 bg-purple-50 text-purple-700",
    featured: "border-blue-200/80 bg-blue-50 text-blue-700",
    none: "border-slate-200/80 bg-slate-50 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[variant]}`}>
      {label}
    </span>
  );
}
