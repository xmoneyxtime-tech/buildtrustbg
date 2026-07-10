export type CompanyPublicProject = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  city: string;
  completedAt: string | null;
  featured: boolean;
  images: Array<{
    id: string;
    imageUrl: string;
    altText: string | null;
    order: number;
  }>;
};

export type CompanyPublicReview = {
  id: string;
  projectTitle: string;
  rating: number;
  title: string;
  description: string;
  createdAt: string;
  verified: boolean;
  reviewerName: string;
  reply: {
    content: string;
    createdAt: string;
    companyName: string;
  } | null;
};

export type CompanyReviewSummary = {
  averageRating: number;
  reviewCount: number;
  verifiedReviews: number;
  positivePercent: number;
  negativePercent: number;
};

export type CompanyReviewPagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  stars: number | null;
  sort: "latest" | "highest" | "lowest";
};

export type CompanyPublicProfile = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  website: string | null;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  services: string[];
  createdAt: Date;
  updatedAt: Date;
  galleryItems: string[];
  projects: CompanyPublicProject[];
  reviews: CompanyPublicReview[];
  reviewSummary: CompanyReviewSummary;
  reviewPagination: CompanyReviewPagination;
};
