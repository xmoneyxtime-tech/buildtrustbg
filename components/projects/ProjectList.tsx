import type { ProjectDto } from "@/app/lib/projects";
import { ProjectCard } from "./ProjectCard";

type ProjectListProps = {
  projects: ProjectDto[];
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
  onTogglePublish: (project: ProjectDto) => void;
  onToggleFeatured: (project: ProjectDto) => void;
};

export function ProjectList({ projects, onEdit, onDelete, onTogglePublish, onToggleFeatured }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">No projects yet</h3>
        <p className="mt-2 text-sm text-slate-600">Create your first project to increase trust and profile visibility.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          showActions
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          onToggleFeatured={onToggleFeatured}
        />
      ))}
    </div>
  );
}
