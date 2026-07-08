type ApplicationCardProps = {
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  onApprove?: () => void;
  onReject?: () => void;
  status?: "pending" | "approved" | "rejected";
};

export function ApplicationCard({
  title,
  subtitle,
  details,
  onApprove,
  onReject,
  status = "pending",
}: ApplicationCardProps) {
  const statusColors = {
    pending: "border-[#F58220]/20 bg-[#FFF7EE]/50 text-[#F58220]",
    approved: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200/80 bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

          <div className="mt-4 space-y-2 border-t border-slate-200/40 pt-4">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{detail.label}:</span>
                <span className="font-medium text-slate-900">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[status]}`}
          >
            {status === "pending"
              ? "Очаква се"
              : status === "approved"
                ? "Одобрено"
                : "Отхвърлено"}
          </span>
        </div>
      </div>

      {status === "pending" && (onApprove || onReject) && (
        <div className="mt-4 flex gap-3 border-t border-slate-200/40 pt-4">
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 rounded-[12px] bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Одобри
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="flex-1 rounded-[12px] border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Отхвърли
            </button>
          )}
        </div>
      )}
    </div>
  );
}
