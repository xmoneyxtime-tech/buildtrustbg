import {
  isRecord,
  isValidEmail,
  isValidPhone,
  isValidHttpUrl,
  sanitizePlainText,
  validateString,
  type ValidationResult,
} from "./core";

export type CompanyApplicationInput = {
  companyName: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  categoryIds: string[];
  description: string;
  website?: string;
};

export function validateCompanyApplicationInput(input: unknown): ValidationResult<CompanyApplicationInput> {
  if (!isRecord(input)) {
    return { success: false, issues: [{ message: "Request body must be an object." }] };
  }

  const categoryIds = Array.isArray(input.categoryIds)
    ? input.categoryIds.map((value) => String(value).trim()).filter(Boolean)
    : [];

  const issues = [
    ...validateString(input.companyName, { field: "companyName", label: "Company name", required: true, minLength: 2, maxLength: 120 }),
    ...validateString(input.email, { field: "email", label: "Email", required: true, maxLength: 254 }),
    ...validateString(input.phone, { field: "phone", label: "Phone", required: true, minLength: 7, maxLength: 20 }),
    ...validateString(input.city, { field: "city", label: "City", required: true, minLength: 2, maxLength: 100 }),
    ...validateString(input.description, { field: "description", label: "Description", required: true, minLength: 20, maxLength: 2000 }),
  ];

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email && !isValidEmail(email)) {
    issues.push({ field: "email", message: "Email format is invalid." });
  }

  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  if (phone && !isValidPhone(phone)) {
    issues.push({ field: "phone", message: "Phone format is invalid." });
  }

  const website = typeof input.website === "string" ? input.website.trim() : "";
  if (website && !isValidHttpUrl(website)) {
    issues.push({ field: "website", message: "Website must be a valid HTTP/HTTPS URL." });
  }

  if (categoryIds.length === 0) {
    issues.push({ field: "categoryIds", message: "At least one category is required." });
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      companyName: sanitizePlainText(String(input.companyName)),
      email,
      phone,
      city: sanitizePlainText(String(input.city)),
      service: typeof input.service === "string" ? sanitizePlainText(input.service) : "",
      categoryIds,
      description: sanitizePlainText(String(input.description)),
      website: website || undefined,
    },
    issues: [],
  };
}
