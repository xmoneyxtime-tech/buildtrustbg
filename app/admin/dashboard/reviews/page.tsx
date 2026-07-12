"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/app/components/ui";
import type { AdminReviewItem } from "@/app/lib/reviews";

type AdminReviewsResponse = {
  reviews: AdminReviewItem[];
  totalCount: number;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/reviews", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Unable to load reviews.");
      }

      const data = (await response.json()) as AdminReviewsResponse;
      setReviews(data.reviews);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReviews();
  }, []);

  async function moderate(
    reviewId: string,
    action: "APPROVE" | "HIDE" | "DELETE" | "RESTORE" | "FLAG" | "REPORT_RESOLVED" | "REPORT_REJECTED",
    status: "APPROVED" | "HIDDEN" | "DELETED" | "PENDING"
  ) {
    try {
      setBusyId(reviewId);
      setError(null);
      const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, status }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Unable to moderate review.");
      }

      await loadReviews();
    } catch (moderateError) {
      setError(moderateError instanceof Error ? moderateError.message : "Unable to moderate review.");
    } finally {
      setBusyId(null);
    }
  }

  const renderStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Review Moderation</h1>
            <p className="mt-1 text-sm text-slate-600">Approve, hide, delete and restore reviews with full history.</p>
          </div>
          <p className="text-sm text-slate-600">Total: {reviews.length}</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
            No reviews available for moderation.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{review.title}</h2>
                    <p className="text-xs text-slate-500">
                      {review.companyName} • {review.projectTitle} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{renderStars(review.rating)}</p>
                    <p className="text-xs font-semibold text-slate-500">{review.status}</p>
                    <p className="text-xs text-slate-500">Reports: {review.reportCount}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-700">{review.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => {
                      void moderate(review.id, "APPROVE", "APPROVED");
                    }}
                    className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => {
                      void moderate(review.id, "HIDE", "HIDDEN");
                    }}
                    className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Hide
                  </button>
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => {
                      void moderate(review.id, "DELETE", "DELETED");
                    }}
                    className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => {
                      void moderate(review.id, "RESTORE", "APPROVED");
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                  >
                    Restore
                  </button>
                  {review.reportCount > 0 && (
                    <>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => {
                          void moderate(review.id, "REPORT_RESOLVED", review.status);
                        }}
                        className="rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 disabled:opacity-60"
                      >
                        Resolve Reports
                      </button>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => {
                          void moderate(review.id, "REPORT_REJECTED", review.status);
                        }}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                      >
                        Reject Reports
                      </button>
                    </>
                  )}
                </div>

                {review.moderationHistory.length > 0 && (
                  <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-700">Moderation history</summary>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {review.moderationHistory.map((item) => (
                        <li key={item.id}>
                          {new Date(item.createdAt).toLocaleString()} • {item.action} • {item.fromStatus ?? "-"} → {item.toStatus}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
