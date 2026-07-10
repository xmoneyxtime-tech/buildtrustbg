import { prisma } from "@/lib/prisma";
import type { ReviewStats } from "./types";

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function hoursBetween(fromDate: Date, toDate: Date): number {
  return (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);
}

export async function calculateCompanyReviewStats(companyId: string): Promise<ReviewStats> {
  const approvedReviews = await prisma.review.findMany({
    where: {
      companyId,
      status: "APPROVED",
      isSpam: false,
    },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      verified: true,
      reply: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? round(approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount)
      : 0;

  const positiveCount = approvedReviews.filter((review) => review.rating >= 4).length;
  const negativeCount = approvedReviews.filter((review) => review.rating <= 2).length;
  const verifiedReviews = approvedReviews.filter((review) => review.verified).length;
  const repliedReviews = approvedReviews.filter((review) => Boolean(review.reply)).length;

  const recentActivity = approvedReviews.filter((review) => {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() - 30);
    return review.createdAt >= threshold;
  }).length;

  const responseDurations = approvedReviews
    .filter((review) => review.reply)
    .map((review) => hoursBetween(review.createdAt, review.reply!.createdAt));

  const averageResponseTimeHours =
    responseDurations.length > 0
      ? round(responseDurations.reduce((sum, value) => sum + value, 0) / responseDurations.length)
      : 0;

  const unresolvedReviews = approvedReviews.filter((review) => !review.reply).length;

  return {
    averageRating,
    reviewCount,
    positivePercent: reviewCount > 0 ? round((positiveCount / reviewCount) * 100) : 0,
    negativePercent: reviewCount > 0 ? round((negativeCount / reviewCount) * 100) : 0,
    responseRate: reviewCount > 0 ? round((repliedReviews / reviewCount) * 100) : 0,
    averageResponseTimeHours,
    recentActivity,
    verifiedReviews,
    unresolvedReviews,
  };
}

export async function syncCompanyReviewAggregates(companyId: string): Promise<ReviewStats> {
  const stats = await calculateCompanyReviewStats(companyId);

  await prisma.companyApplication.update({
    where: {
      id: companyId,
    },
    data: {
      reviewsCount: stats.reviewCount,
      averageRating: stats.averageRating,
      responseTimeHours:
        stats.averageResponseTimeHours > 0 ? Math.round(stats.averageResponseTimeHours) : null,
    },
  });

  return stats;
}
