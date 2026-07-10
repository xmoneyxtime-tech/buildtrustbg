import type { Prisma, ReviewModerationAction, ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugifyProjectTitle } from "@/app/lib/projects";
import { calculateCompanyReviewStats, syncCompanyReviewAggregates } from "./reputation";
import type {
  AdminReviewItem,
  AdminReviewListResult,
  CompanyReviewDto,
  CompanyReviewListResult,
  CreateReviewInput,
  CreateReviewReportInput,
  PublicReviewDto,
  ReviewListResult,
  ReviewQuery,
  SetReviewReactionInput,
  UpdateReviewReplyInput,
} from "./types";

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function mapPublicReview(review: Prisma.ReviewGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    project: { select: { title: true } };
    reply: { include: { company: { select: { companyName: true } } } };
    attachments: true;
    reactions: true;
    reports: true;
    moderationLogs: true;
  };
}>): PublicReviewDto {
  return {
    id: review.id,
    projectId: review.projectId,
    projectTitle: review.project.title,
    rating: review.rating,
    title: review.title,
    description: review.description,
    verified: review.verified,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    reviewerName: review.user.name || review.user.email,
    attachments: review.attachments.map((attachment) => ({
      id: attachment.id,
      fileUrl: attachment.fileUrl,
      altText: attachment.altText,
    })),
    reply: review.reply
      ? {
          id: review.reply.id,
          content: review.reply.content,
          createdAt: review.reply.createdAt.toISOString(),
          updatedAt: review.reply.updatedAt.toISOString(),
          companyName: review.reply.company.companyName,
        }
      : null,
    reactions: {
      helpful: review.reactions.filter((reaction) => reaction.type === "HELPFUL").length,
      notHelpful: review.reactions.filter((reaction) => reaction.type === "NOT_HELPFUL").length,
    },
  };
}

export async function findApprovedCompanyBySlug(slug: string) {
  const companies = await prisma.companyApplication.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      id: true,
      slug: true,
      companyName: true,
      email: true,
    },
  });

  return (
    companies.find((company) => {
      const resolvedSlug = company.slug || slugifyProjectTitle(company.companyName);
      return resolvedSlug === slug;
    }) || null
  );
}

export async function findCompanyOwnerByEmail(email: string) {
  return prisma.companyApplication.findFirst({
    where: {
      email,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      companyName: true,
      email: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    },
  });
}

export async function createReviewForCompany(
  companyId: string,
  userId: string,
  input: CreateReviewInput
): Promise<PublicReviewDto> {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      companyId,
      completedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      companyId: true,
      status: true,
      published: true,
      completedAt: true,
    },
  });

  if (!project) {
    throw new Error("Project not found or not eligible for review.");
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: project.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error("You have already reviewed this project.");
  }

  const latestUserReview = await prisma.review.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      title: true,
      description: true,
      companyId: true,
    },
  });

  if (latestUserReview) {
    const now = Date.now();
    const diffMs = now - latestUserReview.createdAt.getTime();
    if (diffMs < 2 * 60 * 1000) {
      throw new Error("Please wait before submitting another review.");
    }

    const repeatedContent =
      latestUserReview.companyId === companyId &&
      normalizeText(latestUserReview.title) === normalizeText(input.title) &&
      normalizeText(latestUserReview.description) === normalizeText(input.description);

    if (repeatedContent) {
      throw new Error("Duplicate review content detected.");
    }
  }

  const verification = await prisma.verification.findFirst({
    where: {
      companyId,
      status: "APPROVED",
      type: "COMPANY",
    },
    select: {
      id: true,
    },
  });

  const review = await prisma.review.create({
    data: {
      companyId,
      projectId: project.id,
      userId,
      verificationId: verification?.id,
      rating: input.rating,
      title: input.title,
      description: input.description,
      status: "APPROVED",
      verified: project.status === "PUBLISHED" && project.published,
      approvedAt: new Date(),
      attachments: {
        create: (input.attachments ?? []).map((attachment, index) => ({
          fileUrl: attachment.fileUrl,
          altText: attachment.altText || null,
          mimeType: attachment.mimeType || null,
          fileSize: attachment.fileSize ?? null,
          order: attachment.order ?? index,
        })),
      },
    },
    include: {
      user: { select: { name: true, email: true } },
      project: { select: { title: true } },
      reply: {
        include: {
          company: { select: { companyName: true } },
        },
      },
      attachments: true,
      reactions: true,
      reports: true,
      moderationLogs: true,
    },
  });

  await syncCompanyReviewAggregates(companyId);

  return mapPublicReview(review);
}

export async function listPublicCompanyReviews(
  companyId: string,
  query: ReviewQuery
): Promise<ReviewListResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const stars = query.stars ?? null;
  const sort = query.sort ?? "latest";

  const where: Prisma.ReviewWhereInput = {
    companyId,
    status: "APPROVED",
    isSpam: false,
    ...(stars ? { rating: stars } : {}),
  };

  const orderBy: Prisma.ReviewOrderByWithRelationInput[] =
    sort === "highest"
      ? [{ rating: "desc" }, { createdAt: "desc" }]
      : sort === "lowest"
        ? [{ rating: "asc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];

  const [totalCount, reviews, stats] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { title: true } },
        reply: {
          include: {
            company: { select: { companyName: true } },
          },
        },
        attachments: {
          orderBy: {
            order: "asc",
          },
        },
        reactions: true,
        reports: true,
        moderationLogs: true,
      },
    }),
    calculateCompanyReviewStats(companyId),
  ]);

  return {
    reviews: reviews.map(mapPublicReview),
    stats,
    page,
    pageSize,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    stars,
    sort,
  };
}

export async function listCompanyReviews(companyId: string): Promise<CompanyReviewListResult> {
  const [reviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: {
        companyId,
        status: {
          not: "DELETED",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { title: true } },
        reply: {
          include: {
            company: { select: { companyName: true } },
          },
        },
        attachments: {
          orderBy: {
            order: "asc",
          },
        },
        reactions: true,
        reports: true,
        moderationLogs: true,
      },
    }),
    calculateCompanyReviewStats(companyId),
  ]);

  const mapped: CompanyReviewDto[] = reviews.map((review) => ({
    ...mapPublicReview(review),
    reportCount: review.reports.length,
  }));

  return {
    reviews: mapped,
    stats,
  };
}

export async function upsertReviewReply(
  companyId: string,
  reviewId: string,
  userId: string,
  input: UpdateReviewReplyInput
): Promise<PublicReviewDto | null> {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      companyId,
      status: {
        in: ["APPROVED", "HIDDEN"],
      },
    },
    select: {
      id: true,
    },
  });

  if (!review) {
    return null;
  }

  const existingReply = await prisma.reviewReply.findUnique({
    where: {
      reviewId,
    },
    select: {
      id: true,
    },
  });

  if (existingReply) {
    await prisma.reviewReply.update({
      where: {
        reviewId,
      },
      data: {
        content: input.content,
        userId,
      },
    });
  } else {
    await prisma.reviewReply.create({
      data: {
        reviewId,
        companyId,
        userId,
        content: input.content,
      },
    });
  }

  await syncCompanyReviewAggregates(companyId);

  const updated = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: { select: { name: true, email: true } },
      project: { select: { title: true } },
      reply: {
        include: {
          company: { select: { companyName: true } },
        },
      },
      attachments: true,
      reactions: true,
      reports: true,
      moderationLogs: true,
    },
  });

  if (!updated) {
    return null;
  }

  return mapPublicReview(updated);
}

export async function deleteReviewReply(companyId: string, reviewId: string): Promise<boolean> {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (!review) {
    return false;
  }

  await prisma.reviewReply.deleteMany({
    where: {
      reviewId,
      companyId,
    },
  });

  await syncCompanyReviewAggregates(companyId);

  return true;
}

export async function createReviewReport(
  reviewId: string,
  reporterId: string,
  input: CreateReviewReportInput
): Promise<void> {
  const existing = await prisma.reviewReport.findUnique({
    where: {
      reviewId_reporterId: {
        reviewId,
        reporterId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error("You have already reported this review.");
  }

  await prisma.reviewReport.create({
    data: {
      reviewId,
      reporterId,
      reason: input.reason,
      details: input.details,
    },
  });
}

export async function setReviewReaction(
  reviewId: string,
  userId: string,
  input: SetReviewReactionInput
): Promise<void> {
  await prisma.reviewReaction.upsert({
    where: {
      reviewId_userId: {
        reviewId,
        userId,
      },
    },
    create: {
      reviewId,
      userId,
      type: input.type,
    },
    update: {
      type: input.type,
    },
  });
}

export async function listAdminReviews(): Promise<AdminReviewListResult> {
  const reviews = await prisma.review.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      company: {
        select: {
          companyName: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          title: true,
        },
      },
      reply: {
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
        },
      },
      attachments: true,
      reactions: true,
      reports: true,
      moderationLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const mapped: AdminReviewItem[] = reviews.map((review) => ({
    ...mapPublicReview(review),
    reportCount: review.reports.length,
    companyId: review.companyId,
    companyName: review.company.companyName,
    moderationHistory: review.moderationLogs.map((log) => ({
      id: log.id,
      action: log.action,
      fromStatus: log.fromStatus,
      toStatus: log.toStatus,
      reason: log.reason,
      adminId: log.adminId,
      createdAt: log.createdAt.toISOString(),
    })),
  }));

  return {
    reviews: mapped,
    totalCount: mapped.length,
  };
}

export async function moderateReview(
  reviewId: string,
  adminId: string,
  action: ReviewModerationAction,
  toStatus: ReviewStatus,
  reason?: string
): Promise<PublicReviewDto | null> {
  const existing = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: { select: { name: true, email: true } },
      project: { select: { title: true } },
      reply: {
        include: {
          company: { select: { companyName: true } },
        },
      },
      attachments: true,
      reactions: true,
      reports: true,
      moderationLogs: true,
    },
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const review = await tx.review.update({
      where: {
        id: reviewId,
      },
      data: {
        status: toStatus,
        approvedAt: toStatus === "APPROVED" ? new Date() : existing.approvedAt,
      },
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { title: true } },
        reply: {
          include: {
            company: { select: { companyName: true } },
          },
        },
        attachments: true,
        reactions: true,
        reports: true,
        moderationLogs: true,
      },
    });

    await tx.reviewModerationLog.create({
      data: {
        reviewId,
        adminId,
        action,
        reason: reason || null,
        fromStatus: existing.status,
        toStatus,
      },
    });

    if (action === "REPORT_RESOLVED") {
      await tx.reviewReport.updateMany({
        where: {
          reviewId,
          status: "OPEN",
        },
        data: {
          status: "RESOLVED",
          resolvedById: adminId,
          resolvedAt: new Date(),
        },
      });
    }

    if (action === "REPORT_REJECTED") {
      await tx.reviewReport.updateMany({
        where: {
          reviewId,
          status: "OPEN",
        },
        data: {
          status: "REJECTED",
          resolvedById: adminId,
          resolvedAt: new Date(),
        },
      });
    }

    return review;
  });

  await syncCompanyReviewAggregates(existing.companyId);

  return mapPublicReview(updated);
}
