import type { CompanyPublicProfile } from "./types";

type CompanyHeaderProps = {
  company: CompanyPublicProfile;
};

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F58220]">
        Профил на компания
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {company.name}
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-700">{company.city}</p>
    </header>
  );
}
