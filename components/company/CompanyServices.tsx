import type { CompanyPublicProfile } from "./types";

type CompanyServicesProps = {
  company: CompanyPublicProfile;
};

export function CompanyServices({ company }: CompanyServicesProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">Услуги</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {company.services.length > 0 ? (
          company.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              {service}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-600">Все още няма добавени услуги.</p>
        )}
      </div>
    </section>
  );
}
