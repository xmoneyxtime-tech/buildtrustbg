"use client";

import type { CreateProjectInput, ProjectDto, UpdateProjectInput } from "@/app/lib/projects";
import { ProjectForm } from "./ProjectForm";

type ProjectEditorProps = {
  mode: "create" | "edit";
  project?: ProjectDto;
  onSubmit: (payload: CreateProjectInput | UpdateProjectInput) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

export function ProjectEditor({ mode, project, onSubmit, onCancel, submitting = false }: ProjectEditorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        {mode === "create" ? "Create project" : "Edit project"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {mode === "create"
          ? "Add a completed project to improve trust and visibility."
          : "Update your project details and gallery."}
      </p>

      <div className="mt-5">
        <ProjectForm initialProject={project} onSubmit={onSubmit} onCancel={onCancel} submitting={submitting} />
      </div>
    </section>
  );
}
