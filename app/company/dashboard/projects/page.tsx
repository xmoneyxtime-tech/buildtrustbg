"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/ui";
import type { CreateProjectInput, ProjectDto, UpdateProjectInput } from "@/app/lib/projects";
import { ProjectEditor, ProjectList } from "@/components/projects";

type CompanyProjectsResponse = {
  projects: ProjectDto[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/company/projects", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }

      const payload = (await response.json()) as CompanyProjectsResponse;
      setProjects(payload.projects);
    } catch {
      setError("Could not load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function createProject(payload: CreateProjectInput | UpdateProjectInput) {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/company/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "Unable to create project.");
      }

      await loadProjects();
      setMode("list");
      setSuccess("Project created successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function editProject(payload: CreateProjectInput | UpdateProjectInput) {
    if (!editingProject) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/company/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "Unable to update project.");
      }

      await loadProjects();
      setEditingProject(null);
      setMode("list");
      setSuccess("Project updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProject(project: ProjectDto) {
    const confirmed = window.confirm(`Delete project: ${project.title}?`);

    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/company/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Unable to delete project.");
      }

      await loadProjects();
      setSuccess("Project deleted successfully.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to delete project.");
    }
  }

  async function togglePublish(project: ProjectDto) {
    await editProjectAction(project, {
      published: !project.published,
      status: !project.published ? "PUBLISHED" : "DRAFT",
    });
  }

  async function toggleFeatured(project: ProjectDto) {
    await editProjectAction(project, {
      featured: !project.featured,
    });
  }

  async function editProjectAction(project: ProjectDto, payload: UpdateProjectInput) {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/company/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "Unable to update project status.");
      }

      await loadProjects();
      setSuccess("Project updated successfully.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update project status.");
    }
  }

  const headerActions = useMemo(
    () => (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setMode("create");
          }}
          className="rounded-full bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white"
        >
          Create project
        </button>
        <button
          type="button"
          onClick={() => {
            void loadProjects();
          }}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Refresh
        </button>
      </div>
    ),
    []
  );

  return (
    <DashboardShell role="company">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your portfolio projects to improve trust and conversion.
            </p>
          </div>
          {headerActions}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {mode === "create" && (
          <ProjectEditor
            mode="create"
            onSubmit={createProject}
            onCancel={() => setMode("list")}
            submitting={submitting}
          />
        )}

        {mode === "edit" && editingProject && (
          <ProjectEditor
            mode="edit"
            project={editingProject}
            onSubmit={editProject}
            onCancel={() => {
              setEditingProject(null);
              setMode("list");
            }}
            submitting={submitting}
          />
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
            Loading projects...
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onEdit={(project) => {
              setEditingProject(project);
              setMode("edit");
            }}
            onDelete={removeProject}
            onTogglePublish={togglePublish}
            onToggleFeatured={toggleFeatured}
          />
        )}
      </div>
    </DashboardShell>
  );
}
