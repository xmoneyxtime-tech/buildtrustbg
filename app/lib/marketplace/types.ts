export type CompanyRegistrationForm = {
  companyName: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  categoryIds: string[];
  description: string;
  website?: string;
};

export type CompanyStatus = "pending" | "approved" | "rejected";

export type CompanyProfile = {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  description: string;
  website?: string;
  status: CompanyStatus;
  submittedAt: string;
};

export type AdminReviewAction = "approve" | "reject";
