type PaymentMethodsProps = {
  className?: string;
  compact?: boolean;
};

const METHODS = ["Visa", "Mastercard", "Apple Pay", "Google Pay", "Stripe"];

export function PaymentMethods({ className = "", compact = false }: PaymentMethodsProps) {
  const labelClass = compact
    ? "px-2.5 py-1 text-[11px]"
    : "px-3 py-1.5 text-xs";

  return (
    <section
      aria-label="Payment methods"
      className={`rounded-2xl border border-slate-200/80 bg-white/70 p-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {METHODS.map((method) => (
          <span
            key={method}
            className={`inline-flex items-center rounded-full border border-slate-300 bg-white font-medium tracking-wide text-slate-700 ${labelClass}`}
          >
            {method}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-600">Secure payments powered by Stripe</p>
    </section>
  );
}
