"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { DashboardShell } from "@/app/components/ui";
import type { CompanyReviewDto, ReviewStats } from "@/app/lib/reviews";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CompanyReviewDto[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "HIDDEN" | "PENDING">("ALL");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [savingReplyId, setSavingReplyId] = useState<string | null>(null);

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/company/reviews", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load reviews.");
      }

      const data = (await response.json()) as {
        reviews: CompanyReviewDto[];
        stats: ReviewStats;
      };

      setReviews(data.reviews);
      setStats(data.stats);
      setReplyDrafts(
        Object.fromEntries(data.reviews.map((review) => [review.id, review.reply?.content ?? ""]))
      );
    } catch {
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesStatus = statusFilter === "ALL" ? true : review.status === statusFilter;
      const matchesSearch =
        review.title.toLowerCase().includes(search.toLowerCase()) ||
        review.description.toLowerCase().includes(search.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [reviews, search, statusFilter]);

  const pendingReplies = useMemo(
    () => reviews.filter((review) => review.status === "APPROVED" && !review.reply).length,
    [reviews]
  );

  async function submitReply(reviewId: string) {
    const content = (replyDrafts[reviewId] ?? "").trim();

    if (!content) {
      return;
    }

    try {
      setSavingReplyId(reviewId);
      const response = await fetch(`/api/company/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Unable to save reply.");
      }

      await loadReviews();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save reply.");
    } finally {
      setSavingReplyId(null);
    }
  }

  async function deleteReply(reviewId: string) {
    try {
      const response = await fetch(`/api/company/reviews/${reviewId}/reply`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Unable to delete reply.");
      }

      await loadReviews();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete reply.");
    }
  }

  const renderStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <DashboardShell role="company">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Reviews Management</h1>
            <p className="mt-1 text-sm text-slate-600">Track reputation and respond to customers quickly.</p>
          </div>
        </div>

        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Average Rating</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Review Count</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.reviewCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Response Rate</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.responseRate.toFixed(0)}%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending Replies</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{pendingReplies}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews"
            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="ALL">All statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
            No reviews found for the current filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{review.title}</h2>
                    <p className="text-xs text-slate-500">
                      {review.projectTitle} • {new Date(review.createdAt).toLocaleDateString()} • {review.reviewerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{renderStars(review.rating)}</p>
                    <p className="text-xs text-slate-500">{review.status}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-700">{review.description}</p>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company reply</label>
                  <textarea
                    value={replyDrafts[review.id] ?? ""}
                    onChange={(event) =>
                      setReplyDrafts((previous) => ({
                        ...previous,
                        [review.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                    placeholder="Write a response to this review"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={savingReplyId === review.id}
                      onClick={() => {
                        void submitReply(review.id);
                      }}
                      className="rounded-full bg-[#0F4C81] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {review.reply ? "Update reply" : "Send reply"}
                    </button>

                    {review.reply && (
                      <button
                        type="button"
                        onClick={() => {
                          void deleteReply(review.id);
                        }}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700"
                      >
                        Delete reply
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
