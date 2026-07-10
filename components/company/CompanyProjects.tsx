import type { CompanyPublicProfile } from "./types";

type CompanyProjectsProps = {
  company: CompanyPublicProfile;
};

export function CompanyProjects({ company }: CompanyProjectsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">Проекти</h3>
      {company.projects.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
          {company.projects.map((project) => (
            <li key={project} className="rounded-xl bg-slate-50 px-3 py-2">
              {project}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Няма публикувани проекти.</p>
      )}
    </section>
  );
}
