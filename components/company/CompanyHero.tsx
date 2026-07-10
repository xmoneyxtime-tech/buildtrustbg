import type { CompanyPublicProfile } from "./types";

type CompanyHeroProps = {
  company: CompanyPublicProfile;
};

export function CompanyHero({ company }: CompanyHeroProps) {
  return (
    <section className="rounded-3xl border border-[#0F4C81]/10 bg-gradient-to-br from-[#0F4C81] to-[#1F6CAB] p-6 text-white sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F8CFA6]">
        BuildTrustBG
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {company.name}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base">
        {company.description}
      </p>
    </section>
  );
}
