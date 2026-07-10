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
  projects: string[];
  reviews: string[];
};
