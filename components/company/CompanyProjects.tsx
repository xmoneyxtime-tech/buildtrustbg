import type { CompanyPublicProfile } from "./types";
import { ProjectGallery } from "@/components/projects";

type CompanyProjectsProps = {
  company: CompanyPublicProfile;
};

export function CompanyProjects({ company }: CompanyProjectsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">Проекти</h3>
      {company.projects.length > 0 ? (
        <ul className="mt-4 space-y-5 text-sm leading-7 text-slate-700">
          {company.projects.map((project) => (
            <li key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-slate-900">{project.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{project.shortDescription}</p>
                </div>
                {project.featured && (
                  <span className="rounded-full bg-[#F58220]/10 px-2.5 py-1 text-xs font-semibold text-[#B85A00]">
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-700">{project.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.city}</span>
                {project.completedAt && (
                  <>
                    <span>•</span>
                    <span>{new Date(project.completedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              <div className="mt-3">
                <ProjectGallery images={project.images} compact />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Няма публикувани проекти.</p>
      )}
    </section>
  );
}
