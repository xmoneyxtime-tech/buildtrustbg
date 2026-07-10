import type { CompanyPublicProfile } from "./types";

type CompanyReviewsProps = {
  company: CompanyPublicProfile;
};

export function CompanyReviews({ company }: CompanyReviewsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900">Отзиви</h3>
      {company.reviews.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
          {company.reviews.map((review) => (
            <li key={review} className="rounded-xl bg-slate-50 px-3 py-2">
              {review}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Все още няма публикувани отзиви.</p>
      )}
    </section>
  );
}
