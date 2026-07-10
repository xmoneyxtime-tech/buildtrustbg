import type { CompanyPublicProfile } from "./types";

type CompanyAboutProps = {
  company: CompanyPublicProfile;
};

export function CompanyAbout({ company }: CompanyAboutProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">За компанията</h3>
      <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
        {company.description}
      </p>
    </section>
  );
}
