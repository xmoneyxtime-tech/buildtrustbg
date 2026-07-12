import { isRecord, sanitizePlainText, validateString, isValidEmail, type ValidationResult } from "./core";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginCredentialsInput = {
  email: string;
  password: string;
};

export function validateRegisterInput(input: unknown): ValidationResult<RegisterInput> {
  if (!isRecord(input)) {
    return { success: false, issues: [{ message: "Request body must be an object." }] };
  }

  const issues = [
    ...validateString(input.name, { field: "name", label: "Name", required: true, minLength: 2, maxLength: 120 }),
    ...validateString(input.email, { field: "email", label: "Email", required: true, maxLength: 254 }),
    ...validateString(input.password, { field: "password", label: "Password", required: true, minLength: 8, maxLength: 128, trim: false }),
  ];

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email && !isValidEmail(email)) {
    issues.push({ field: "email", message: "Email format is invalid." });
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      name: sanitizePlainText(String(input.name)),
      email,
      password: String(input.password),
    },
    issues: [],
  };
}

export function validateLoginCredentials(input: unknown): ValidationResult<LoginCredentialsInput> {
  if (!isRecord(input)) {
    return { success: false, issues: [{ message: "Credentials payload must be an object." }] };
  }

  const issues = [
    ...validateString(input.email, { field: "email", label: "Email", required: true, maxLength: 254 }),
    ...validateString(input.password, { field: "password", label: "Password", required: true, minLength: 1, maxLength: 128, trim: false }),
  ];

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email && !isValidEmail(email)) {
    issues.push({ field: "email", message: "Email format is invalid." });
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      email,
      password: String(input.password),
    },
    issues: [],
  };
}
