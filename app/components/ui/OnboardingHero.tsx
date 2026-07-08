type OnboardingHeroProps = {
  companyName?: string;
};

export function OnboardingHero({ companyName = "Вашата фирма" }: OnboardingHeroProps) {
  return (
    <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fbff_100%)] px-8 py-12 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.24)] sm:px-10 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
            Добре дошли
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Добре дошли в BuildTrustBG 👋
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            Вашият фирмен профил на <span className="font-semibold">{companyName}</span> беше създаден успешно. Следвайте стъпките по-долу, за да активирате публичния си профил и започнете да получавате клиенти.
          </p>
        </div>
        <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-[#FFF7EE] text-5xl shadow-sm">
          🏢
        </div>
      </div>
    </div>
  );
}
