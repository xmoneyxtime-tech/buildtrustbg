import type { ProjectStatus } from "@prisma/client";

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
};

const statusStyles: Record<ProjectStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-amber-100 text-amber-700",
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
