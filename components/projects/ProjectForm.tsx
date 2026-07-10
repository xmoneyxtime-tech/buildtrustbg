"use client";

import { useMemo, useState } from "react";
import type { ProjectCategory } from "@prisma/client";
import type { CreateProjectInput, ProjectDto, UpdateProjectInput } from "@/app/lib/projects";

type ProjectFormProps = {
  initialProject?: ProjectDto;
  onSubmit: (payload: CreateProjectInput | UpdateProjectInput) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
};

const categoryOptions: ProjectCategory[] = [
  "GENERAL",
  "RESIDENTIAL",
  "COMMERCIAL",
  "RENOVATION",
  "INFRASTRUCTURE",
  "INTERIOR",
];

export function ProjectForm({ initialProject, onSubmit, onCancel, submitting = false }: ProjectFormProps) {
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [shortDescription, setShortDescription] = useState(initialProject?.shortDescription ?? "");
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [category, setCategory] = useState<ProjectCategory>(initialProject?.category ?? "GENERAL");
  const [city, setCity] = useState(initialProject?.city ?? "");
  const [completedAt, setCompletedAt] = useState(
    initialProject?.completedAt ? initialProject.completedAt.slice(0, 10) : ""
  );
  const [featured, setFeatured] = useState(initialProject?.featured ?? false);
  const [published, setPublished] = useState(initialProject?.published ?? false);
  const [imageText, setImageText] = useState(
    initialProject?.images.map((image) => image.imageUrl).join("\n") ?? ""
  );

  const isEdit = Boolean(initialProject);

  const payload = useMemo(() => {
    const imageUrls = imageText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    return {
      title,
      shortDescription,
      description,
      category,
      city,
      completedAt: completedAt || null,
      featured,
      published,
      images: imageUrls.map((imageUrl, index) => ({
        imageUrl,
        altText: title,
        order: index,
      })),
    } satisfies CreateProjectInput;
  }, [title, shortDescription, description, category, city, completedAt, featured, published, imageText]);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(payload);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">City</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
        </label>
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-slate-700">Short description</span>
        <input
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          required
        />
      </label>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-slate-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as ProjectCategory)} className="w-full rounded-xl border border-slate-200 px-3 py-2">
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Completed at</span>
          <input type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
        </label>
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-slate-700">Image URLs (one URL per line)</span>
        <textarea
          value={imageText}
          onChange={(e) => setImageText(e.target.value)}
          className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2"
          placeholder="https://..."
        />
      </label>

      <div className="flex flex-wrap gap-5 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publish project
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured project
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="rounded-full bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create project"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
