/**
 * Validation Schema for Company Profile
 * 
 * Centralized validation for company profile updates.
 * Ensures all input is safe and properly formatted.
 */

import { CompanyProfileUpdateInput, ProfileValidationError } from "./types";
import { sanitizePlainText } from "@/app/lib/validation/core";

interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
}

/**
 * Validation rules for each field
 */
const VALIDATION_RULES: Partial<
  Record<keyof CompanyProfileUpdateInput, ValidationRule>
> = {
  companyName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-\.,&']/,
    required: false,
  },
  description: {
    minLength: 10,
    maxLength: 2000,
    required: false,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 7,
    maxLength: 20,
    required: false,
  },
  website: {
    pattern: /^https?:\/\/.+/,
    required: false,
  },
  country: {
    minLength: 2,
    maxLength: 100,
    required: false,
  },
  city: {
    minLength: 2,
    maxLength: 100,
    required: false,
  },
  address: {
    minLength: 5,
    maxLength: 200,
    required: false,
  },
  industry: {
    minLength: 2,
    maxLength: 100,
    required: false,
  },
  logoUrl: {
    pattern: /^https?:\/\/.+/,
    required: false,
  },
  coverImageUrl: {
    pattern: /^https?:\/\/.+/,
    required: false,
  },
};

/**
 * Validate a single field
 */
function validateField(
  field: keyof CompanyProfileUpdateInput,
  value: unknown
): ProfileValidationError | null {
  if (value === undefined || value === null || value === "") {
    return null; // Optional fields
  }

  const rules = VALIDATION_RULES[field];
  if (!rules) return null;

  const stringValue = String(value).trim();

  // Check length
  if (rules.minLength !== undefined && stringValue.length < rules.minLength) {
    return {
      field,
      message: `Minimum ${rules.minLength} characters required`,
    };
  }

  if (rules.maxLength !== undefined && stringValue.length > rules.maxLength) {
    return {
      field,
      message: `Maximum ${rules.maxLength} characters allowed`,
    };
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return {
      field,
      message: `Invalid format for ${field}`,
    };
  }

  return null;
}

/**
 * Validate entire profile update input
 */
export function validateProfileUpdate(
  input: CompanyProfileUpdateInput
): ProfileValidationError[] {
  const errors: ProfileValidationError[] = [];

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const error = validateField(key as keyof CompanyProfileUpdateInput, value);
      if (error) {
        errors.push(error);
      }
    }
  });

  return errors;
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeProfileInput(
  input: CompanyProfileUpdateInput
): CompanyProfileUpdateInput {
  const sanitized: CompanyProfileUpdateInput = {};

  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === "string") {
      // Remove HTML tags and trim
      sanitized[key as keyof CompanyProfileUpdateInput] = value
        ? sanitizePlainText(value)
        : value;
    } else {
      sanitized[key as keyof CompanyProfileUpdateInput] = value;
    }
  });

  return sanitized;
}

/**
 * Check if input has at least one field to update
 */
export function hasUpdateFields(
  input: CompanyProfileUpdateInput
): boolean {
  return Object.values(input).some(
    (value) => value !== undefined && value !== null && value !== ""
  );
}
