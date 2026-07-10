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
  reviews: string[];
};
