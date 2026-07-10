/**
 * Extended Company Profile Types
 * 
 * Includes all fields needed for company profile management:
 * - General info (name, description, industry)
 * - Contact (email, phone, website)
 * - Location (country, city, address)
 * - Branding (logo, cover image)
 * - Metrics (profile completion, trust score, timestamps)
 */

export type CompanyProfileField = 
  | "companyName"
  | "description"
  | "email"
  | "phone"
  | "website"
  | "country"
  | "city"
  | "address"
  | "industry"
  | "logoUrl"
  | "coverImageUrl";

export interface CompanyProfileData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  industry: string;
  description: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  status: "pending" | "approved" | "rejected";
  profileCompletion: number; // 0-100
  trustScore: number; // 0-100
  submittedAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Form data for editing company profile
 * All fields are optional to support partial updates
 */
export interface CompanyProfileUpdateInput {
  companyName?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  address?: string;
  industry?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}

/**
 * Activity event types
 */
export type ActivityEventType =
  | "profile_updated"
  | "logo_changed"
  | "cover_image_changed"
  | "contact_updated"
  | "location_updated"
  | "verification_requested"
  | "trust_score_updated"
  | "profile_completed";

export interface ActivityEvent {
  id: string;
  companyId: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  timestamp: string; // ISO timestamp
}

/**
 * Profile completion checklist
 */
export interface ProfileCompletionItem {
  key: CompanyProfileField | "logo" | "coverImage" | "gallery" | "projects" | "workingHours" | "verification" | "socialLinks";
  label: string;
  completed: boolean;
}

/**
 * API Response types
 */
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile?: CompanyProfileData;
  profileCompletion?: number;
  trustScore?: number;
  activity?: ActivityEvent;
}

export interface ProfileValidationError {
  field: string;
  message: string;
}
