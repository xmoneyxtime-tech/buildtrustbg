import type { ProjectDto } from "@/app/lib/projects";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

type ProjectCardProps = {
  project: ProjectDto;
  showActions?: boolean;
  onEdit?: (project: ProjectDto) => void;
  onDelete?: (project: ProjectDto) => void;
  onTogglePublish?: (project: ProjectDto) => void;
  onToggleFeatured?: (project: ProjectDto) => void;
};

export function ProjectCard({
  project,
  showActions = false,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{project.shortDescription}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="inline-flex rounded-full bg-[#F58220]/10 px-2.5 py-1 text-xs font-semibold text-[#B85A00]">
              Featured
            </span>
          )}
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{project.description}</p>

      <div className="mt-4">
        <ProjectGallery images={project.images} compact />
      </div>

      {showActions && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(project)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onTogglePublish?.(project)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {project.published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => onToggleFeatured?.(project)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {project.featured ? "Unset featured" : "Set featured"}
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(project)}
            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
