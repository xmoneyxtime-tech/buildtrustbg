export type ValidationIssue = {
  field?: string;
  message: string;
};

export type ValidationResult<T> =
  | { success: true; data: T; issues: [] }
  | { success: false; issues: ValidationIssue[] };

type StringRuleOptions = {
  field: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  trim?: boolean;
};

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function sanitizePlainText(value: string): string {
  return normalizeWhitespace(value.replace(/<[^>]*>/g, ""));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  return /^[\d\s+()\-]+$/.test(value);
}

export function isValidDateString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function normalizeIssueMessages(issues: Array<string | ValidationIssue>): string[] {
  return issues.map((issue) => (typeof issue === "string" ? issue : issue.message));
}

export function validateString(value: unknown, options: StringRuleOptions): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (typeof value !== "string") {
    if (options.required) {
      issues.push({ field: options.field, message: `${options.label} is required.` });
    }
    return issues;
  }

  const normalized = options.trim === false ? value : value.trim();

  if (!normalized) {
    if (options.required) {
      issues.push({ field: options.field, message: `${options.label} is required.` });
    }
    return issues;
  }

  if (options.minLength !== undefined && normalized.length < options.minLength) {
    issues.push({
      field: options.field,
      message: `${options.label} must be at least ${options.minLength} characters.`,
    });
  }

  if (options.maxLength !== undefined && normalized.length > options.maxLength) {
    issues.push({
      field: options.field,
      message: `${options.label} must be at most ${options.maxLength} characters.`,
    });
  }

  if (options.pattern && !options.pattern.test(normalized)) {
    issues.push({
      field: options.field,
      message: options.patternMessage || `${options.label} format is invalid.`,
    });
  }

  return issues;
}

export function validateIdentifier(value: unknown, field: string, label: string): ValidationIssue[] {
  return validateString(value, {
    field,
    label,
    required: true,
    minLength: 3,
    maxLength: 191,
  });
}
