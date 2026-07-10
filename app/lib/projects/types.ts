import type { ProjectCategory, ProjectStatus } from "@prisma/client";

export type ProjectImageInput = {
  imageUrl: string;
  altText?: string;
  order: number;
};

export type CreateProjectInput = {
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  city: string;
  completedAt?: string | null;
  featured?: boolean;
  published?: boolean;
  images: ProjectImageInput[];
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
};

export type ProjectImageDto = {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
};

export type ProjectDto = {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  city: string;
  completedAt: string | null;
  featured: boolean;
  published: boolean;
  status: ProjectStatus;
  images: ProjectImageDto[];
  createdAt: string;
  updatedAt: string;
};

export type CompanyProjectsResponse = {
  projects: ProjectDto[];
};

export type CompanyProjectResponse = {
  project: ProjectDto;
};

export type ApiErrorResponse = {
  error: string;
};
