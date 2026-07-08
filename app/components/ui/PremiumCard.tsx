export function PremiumCard() {
  const benefits = [
    "Приоритетно класиране",
    "Неограничена галерия",
    "Избран профил",
    "Статистика и аналитика",
    "Подкрепа на разширяване",
  ];

  return (
    <div className="rounded-[28px] border border-[#F58220]/20 bg-gradient-to-br from-[#FFF7EE] to-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#F58220]/30 bg-[#FFE8D0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            Premium
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">BuildTrustBG Premium</h3>
          <p className="mt-3 text-slate-700">
            <span className="text-3xl font-bold text-slate-900">29 €</span>
            <span className="text-slate-600"> / месец</span>
          </p>
        </div>
        <div className="text-4xl">💎</div>
      </div>

      <div className="mt-6 space-y-2">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="text-[#F58220]">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#F58220] px-6 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
        Станете Premium абонат
      </button>
    </div>
  );
}
