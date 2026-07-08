export function FeaturedCompanyCard() {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            Featured
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Избрана фирма</h3>
          <p className="mt-3 text-slate-700">Бъдете сред първите резултати при търсене и достигнете до повече клиенти.</p>
        </div>
        <div className="text-4xl">⭐</div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-[#F58220]/20 bg-[#FFF7EE] p-4 text-sm leading-7 text-slate-700">
        <p>
          ⭐ Избраните фирми се показват с приоритет на началната страница, в категориите и в резултатите от търсенето, което значително увеличава тяхната видимост и броя на получените запитвания.
        </p>
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-white px-6 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
        Научете повече
      </button>
    </div>
  );
}
