import type { ProjectImageDto } from "@/app/lib/projects";

type ProjectGalleryProps = {
  images: ProjectImageDto[];
  compact?: boolean;
};

export function ProjectGallery({ images, compact = false }: ProjectGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        No project images yet.
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
      {images.map((image) => (
        <figure key={image.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img src={image.imageUrl} alt={image.altText ?? "Project image"} className="h-36 w-full object-cover" />
        </figure>
      ))}
    </div>
  );
}
