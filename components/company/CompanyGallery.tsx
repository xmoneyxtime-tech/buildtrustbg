import type { CompanyPublicProfile } from "./types";

type CompanyGalleryProps = {
  company: CompanyPublicProfile;
};

export function CompanyGallery({ company }: CompanyGalleryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">Галерия</h3>
      {company.galleryItems.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {company.galleryItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          Няма публикувани снимки. Качването ще бъде активирано в следващ спринт.
        </p>
      )}
    </section>
  );
}
