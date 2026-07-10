import type {
  ReviewModerationAction,
  ReviewReactionType,
  ReviewReportReason,
  ReviewStatus,
} from "@prisma/client";

export type ReviewAttachmentInput = {
  fileUrl: string;
  altText?: string;
  mimeType?: string;
  fileSize?: number;
  order?: number;
};

export type CreateReviewInput = {
  projectId: string;
  rating: number;
  title: string;
  description: string;
  attachments?: ReviewAttachmentInput[];
};

export type UpdateReviewReplyInput = {
  content: string;
};

export type CreateReviewReportInput = {
  reason: ReviewReportReason;
  details?: string;
};

export type SetReviewReactionInput = {
  type: ReviewReactionType;
};

export type ReviewQuery = {
  page?: number;
  pageSize?: number;
  stars?: number;
  sort?: "latest" | "highest" | "lowest";
};

export type ReviewStats = {
  averageRating: number;
  reviewCount: number;
  positivePercent: number;
  negativePercent: number;
  responseRate: number;
  averageResponseTimeHours: number;
  recentActivity: number;
  verifiedReviews: number;
  unresolvedReviews: number;
};

export type PublicReviewReplyDto = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
};

export type PublicReviewDto = {
  id: string;
  projectId: string;
  projectTitle: string;
  rating: number;
  title: string;
  description: string;
  verified: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  attachments: Array<{
    id: string;
    fileUrl: string;
    altText: string | null;
  }>;
  reply: PublicReviewReplyDto | null;
  reactions: {
    helpful: number;
    notHelpful: number;
  };
};

export type ReviewListResult = {
  reviews: PublicReviewDto[];
  stats: ReviewStats;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  stars: number | null;
  sort: "latest" | "highest" | "lowest";
};

export type CompanyReviewDto = PublicReviewDto & {
  reportCount: number;
};

export type CompanyReviewListResult = {
  reviews: CompanyReviewDto[];
  stats: ReviewStats;
};

export type AdminReviewItem = CompanyReviewDto & {
  companyId: string;
  companyName: string;
  moderationHistory: Array<{
    id: string;
    action: ReviewModerationAction;
    fromStatus: ReviewStatus | null;
    toStatus: ReviewStatus;
    reason: string | null;
    adminId: string;
    createdAt: string;
  }>;
};

export type AdminReviewListResult = {
  reviews: AdminReviewItem[];
  totalCount: number;
};
