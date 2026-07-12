import type { ReviewReportReason, ReviewReactionType, ReviewStatus } from "@prisma/client";
import type {
  CreateReviewInput,
  CreateReviewReportInput,
  ReviewQuery,
  SetReviewReactionInput,
  UpdateReviewReplyInput,
} from "./types";
import {
  isValidHttpUrl,
  normalizeIssueMessages,
  sanitizePlainText,
  validateIdentifier,
  type ValidationIssue,
} from "@/app/lib/validation/core";

const REPORT_REASONS: ReviewReportReason[] = [
  "SPAM",
  "ABUSE",
  "OFF_TOPIC",
  "FAKE",
  "CONFLICT_OF_INTEREST",
  "OTHER",
];

const REACTION_TYPES: ReviewReactionType[] = ["HELPFUL", "NOT_HELPFUL"];

const ADMIN_STATUSES: ReviewStatus[] = ["APPROVED", "HIDDEN", "DELETED", "PENDING"];

function sanitizeText(value: string): string {
  return sanitizePlainText(value);
}

export function validateCreateReviewInput(input: CreateReviewInput): string[] {
  const issues: ValidationIssue[] = [];

  issues.push(...validateIdentifier(input.projectId, "projectId", "Project"));

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    issues.push({ field: "rating", message: "Rating must be between 1 and 5." });
  }

  const title = sanitizeText(input.title || "");
  if (title.length < 3 || title.length > 120) {
    issues.push({ field: "title", message: "Title must be between 3 and 120 characters." });
  }

  const description = sanitizeText(input.description || "");
  if (description.length < 20 || description.length > 4000) {
    issues.push({ field: "description", message: "Description must be between 20 and 4000 characters." });
  }

  if (input.attachments && input.attachments.length > 10) {
    issues.push({ field: "attachments", message: "Maximum 10 attachments are allowed." });
  }

  for (const attachment of input.attachments ?? []) {
    if (!isValidHttpUrl(attachment.fileUrl)) {
      issues.push({ field: "attachments", message: "Each attachment URL must be a valid HTTP/HTTPS URL." });
    }

    if (attachment.altText && attachment.altText.trim().length > 180) {
      issues.push({ field: "attachments", message: "Attachment alt text cannot exceed 180 characters." });
    }
  }

  return normalizeIssueMessages(issues);
}

export function sanitizeCreateReviewInput(input: CreateReviewInput): CreateReviewInput {
  return {
    ...input,
    projectId: input.projectId.trim(),
    title: sanitizeText(input.title),
    description: sanitizeText(input.description),
    attachments: (input.attachments ?? []).map((item, index) => ({
      fileUrl: item.fileUrl.trim(),
      altText: item.altText?.trim() || undefined,
      mimeType: item.mimeType?.trim() || undefined,
      fileSize: item.fileSize,
      order: item.order ?? index,
    })),
  };
}

export function validateReviewReplyInput(input: UpdateReviewReplyInput): string[] {
  const issues: ValidationIssue[] = [];
  const content = sanitizeText(input.content || "");

  if (content.length < 3 || content.length > 2000) {
    issues.push({ field: "content", message: "Reply must be between 3 and 2000 characters." });
  }

  return normalizeIssueMessages(issues);
}

export function sanitizeReviewReplyInput(input: UpdateReviewReplyInput): UpdateReviewReplyInput {
  return {
    content: sanitizeText(input.content),
  };
}

export function validateReviewQuery(input: ReviewQuery): ReviewQuery {
  const page = Number.isFinite(input.page) ? Math.max(1, Number(input.page)) : 1;
  const pageSize = Number.isFinite(input.pageSize)
    ? Math.max(1, Math.min(50, Number(input.pageSize)))
    : 10;
  const stars = Number.isFinite(input.stars) ? Math.min(5, Math.max(1, Number(input.stars))) : undefined;
  const sort = input.sort === "highest" || input.sort === "lowest" ? input.sort : "latest";

  return {
    page,
    pageSize,
    stars,
    sort,
  };
}

export function validateReviewReportInput(input: CreateReviewReportInput): string[] {
  const issues: ValidationIssue[] = [];

  if (!REPORT_REASONS.includes(input.reason)) {
    issues.push({ field: "reason", message: "Invalid report reason." });
  }

  if (input.details && input.details.trim().length > 1500) {
    issues.push({ field: "details", message: "Report details cannot exceed 1500 characters." });
  }

  return normalizeIssueMessages(issues);
}

export function sanitizeReviewReportInput(input: CreateReviewReportInput): CreateReviewReportInput {
  return {
    reason: input.reason,
    details: input.details?.trim() || undefined,
  };
}

export function validateReactionInput(input: SetReviewReactionInput): string[] {
  if (!REACTION_TYPES.includes(input.type)) {
    return ["Invalid reaction type."];
  }

  return [];
}

export function validateAdminModerationInput(status: ReviewStatus): boolean {
  return ADMIN_STATUSES.includes(status);
}
