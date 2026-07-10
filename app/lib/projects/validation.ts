import type { ProjectCategory, ProjectStatus } from "@prisma/client";
import type { CreateProjectInput, ProjectImageInput, UpdateProjectInput } from "./types";

const VALID_CATEGORIES: ProjectCategory[] = [
  "GENERAL",
  "RESIDENTIAL",
  "COMMERCIAL",
  "RENOVATION",
  "INFRASTRUCTURE",
  "INTERIOR",
];

const VALID_STATUSES: ProjectStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeImages(images: ProjectImageInput[]): ProjectImageInput[] {
  return images
    .map((image, index) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText?.trim() || undefined,
      order: image.order ?? index,
    }))
    .filter((image) => image.imageUrl.length > 0);
}

export function validateCreateProjectInput(input: CreateProjectInput): string[] {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length < 3 || input.title.trim().length > 120) {
    errors.push("Title must be between 3 and 120 characters.");
  }

  if (
    !input.shortDescription ||
    input.shortDescription.trim().length < 10 ||
    input.shortDescription.trim().length > 240
  ) {
    errors.push("Short description must be between 10 and 240 characters.");
  }

  if (!input.description || input.description.trim().length < 20 || input.description.trim().length > 4000) {
    errors.push("Description must be between 20 and 4000 characters.");
  }

  if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push("Invalid project category.");
  }

  if (!input.city || input.city.trim().length < 2 || input.city.trim().length > 80) {
    errors.push("City must be between 2 and 80 characters.");
  }

  if (input.completedAt && Number.isNaN(Date.parse(input.completedAt))) {
    errors.push("Invalid completion date.");
  }

  const images = sanitizeImages(input.images);
  if (images.length > 20) {
    errors.push("Maximum 20 images are allowed.");
  }

  images.forEach((image) => {
    if (!isValidUrl(image.imageUrl)) {
      errors.push("Each project image must be a valid URL.");
    }
  });

  return errors;
}

export function validateUpdateProjectInput(input: UpdateProjectInput): string[] {
  const errors: string[] = [];

  if (input.title !== undefined && (input.title.trim().length < 3 || input.title.trim().length > 120)) {
    errors.push("Title must be between 3 and 120 characters.");
  }

  if (
    input.shortDescription !== undefined &&
    (input.shortDescription.trim().length < 10 || input.shortDescription.trim().length > 240)
  ) {
    errors.push("Short description must be between 10 and 240 characters.");
  }

  if (
    input.description !== undefined &&
    (input.description.trim().length < 20 || input.description.trim().length > 4000)
  ) {
    errors.push("Description must be between 20 and 4000 characters.");
  }

  if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
    errors.push("Invalid project category.");
  }

  if (input.city !== undefined && (input.city.trim().length < 2 || input.city.trim().length > 80)) {
    errors.push("City must be between 2 and 80 characters.");
  }

  if (input.completedAt && Number.isNaN(Date.parse(input.completedAt))) {
    errors.push("Invalid completion date.");
  }

  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    errors.push("Invalid project status.");
  }

  if (input.images !== undefined) {
    const images = sanitizeImages(input.images);
    if (images.length > 20) {
      errors.push("Maximum 20 images are allowed.");
    }

    images.forEach((image) => {
      if (!isValidUrl(image.imageUrl)) {
        errors.push("Each project image must be a valid URL.");
      }
    });
  }

  return errors;
}

export function sanitizeCreateProjectInput(input: CreateProjectInput): CreateProjectInput {
  return {
    ...input,
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    city: input.city.trim(),
    completedAt: input.completedAt ?? null,
    featured: Boolean(input.featured),
    published: Boolean(input.published),
    images: sanitizeImages(input.images),
  };
}

export function sanitizeUpdateProjectInput(input: UpdateProjectInput): UpdateProjectInput {
  const output: UpdateProjectInput = { ...input };

  if (output.title !== undefined) {
    output.title = output.title.trim();
  }

  if (output.shortDescription !== undefined) {
    output.shortDescription = output.shortDescription.trim();
  }

  if (output.description !== undefined) {
    output.description = output.description.trim();
  }

  if (output.city !== undefined) {
    output.city = output.city.trim();
  }

  if (output.images !== undefined) {
    output.images = sanitizeImages(output.images);
  }

  return output;
}
