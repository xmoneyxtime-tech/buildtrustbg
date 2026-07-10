"use client";

import { useState } from "react";
import type { CompanyPublicProfile } from "./types";

type CompanyReviewsProps = {
  company: CompanyPublicProfile;
};

export function CompanyReviews({ company }: CompanyReviewsProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    projectId: company.projects[0]?.id ?? "",
    rating: 5,
    title: "",
    description: "",
  });

  const summary = company.reviewSummary;

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  async function submitReview() {
    if (!form.projectId) {
      setError("Избери проект.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const response = await fetch(`/api/companies/${company.slug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: form.projectId,
          rating: form.rating,
          title: form.title,
          description: form.description,
          attachments: [],
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешно изпращане на отзив.");
      }

      setMessage("Отзивът е изпратен успешно.");
      setForm((previous) => ({
        ...previous,
        title: "",
        description: "",
      }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Неуспешно изпращане на отзив.");
    } finally {
      setSubmitting(false);
    }
  }

  async function reportReview(reviewId: string) {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "SPAM",
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешно докладване.");
      }

      setMessage("Отзивът беше докладван.");
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : "Неуспешно докладване.");
    }
  }

  async function react(reviewId: string, type: "HELPFUL" | "NOT_HELPFUL") {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Неуспешна реакция.");
      }

      setMessage("Реакцията е запазена.");
    } catch (reactionError) {
      setError(reactionError instanceof Error ? reactionError.message : "Неуспешна реакция.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">Отзиви</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">{summary.averageRating.toFixed(1)} / 5</p>
          <p className="text-sm text-slate-600">{summary.reviewCount} отзива</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
          Verified: {summary.verifiedReviews}
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-green-700">
          Positive: {summary.positivePercent.toFixed(0)}%
        </span>
        <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700">
          Negative: {summary.negativePercent.toFixed(0)}%
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <a
          href={`?sort=latest${company.reviewPagination.stars ? `&stars=${company.reviewPagination.stars}` : ""}`}
          className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
        >
          Най-нови
        </a>
        <a
          href={`?sort=highest${company.reviewPagination.stars ? `&stars=${company.reviewPagination.stars}` : ""}`}
          className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
        >
          Най-високи
        </a>
        <a
          href={`?sort=lowest${company.reviewPagination.stars ? `&stars=${company.reviewPagination.stars}` : ""}`}
          className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
        >
          Най-ниски
        </a>
        <a href={`?sort=${company.reviewPagination.sort}`} className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700">
          Всички звезди
        </a>
        {[5, 4, 3, 2, 1].map((stars) => (
          <a
            key={stars}
            href={`?sort=${company.reviewPagination.sort}&stars=${stars}`}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-700"
          >
            {stars}★
          </a>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">Остави отзив</h4>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            value={form.projectId}
            onChange={(event) => setForm((previous) => ({ ...previous, projectId: event.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {company.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          <select
            value={form.rating}
            onChange={(event) => setForm((previous) => ({ ...previous, rating: Number(event.target.value) }))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} ★
              </option>
            ))}
          </select>
        </div>

        <input
          value={form.title}
          onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
          placeholder="Заглавие"
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        />

        <textarea
          value={form.description}
          onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
          placeholder="Опиши опита си с изпълнението"
          rows={4}
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        />

        <button
          type="button"
          onClick={() => {
            void submitReview();
          }}
          disabled={submitting}
          className="mt-3 rounded-full bg-[#0F4C81] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          Изпрати отзив
        </button>
      </div>

      {message && <p className="mt-3 text-xs text-green-700">{message}</p>}
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}

      {company.reviews.length > 0 ? (
        <ul className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          {company.reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{review.title}</p>
                  <p className="text-xs text-slate-500">{review.projectTitle} • {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-600">{renderStars(review.rating)}</p>
                  {review.verified && (
                    <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 text-slate-700">{review.description}</p>
              <p className="mt-1 text-xs text-slate-500">от {review.reviewerName}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void react(review.id, "HELPFUL");
                  }}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                >
                  Полезен
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void react(review.id, "NOT_HELPFUL");
                  }}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                >
                  Неполезен
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void reportReview(review.id);
                  }}
                  className="rounded-full border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-700"
                >
                  Докладвай
                </button>
              </div>

              {review.reply && (
                <div className="mt-3 rounded-xl border border-[#0F4C81]/20 bg-white px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4C81]">Отговор от {review.reply.companyName}</p>
                  <p className="mt-1 text-sm text-slate-700">{review.reply.content}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Все още няма публикувани отзиви.</p>
      )}

      {company.reviewPagination.totalPages > 1 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {Array.from({ length: company.reviewPagination.totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <a
                key={page}
                href={`?page=${page}&sort=${company.reviewPagination.sort}${company.reviewPagination.stars ? `&stars=${company.reviewPagination.stars}` : ""}`}
                className={`rounded-full border px-2.5 py-1 ${
                  page === company.reviewPagination.page
                    ? "border-[#0F4C81] bg-[#0F4C81] text-white"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                {page}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
