import { isRecord, sanitizePlainText, validateString, type ValidationResult } from "./core";

export type AiMessageInput = {
  message: string;
};

export function validateAiMessageInput(input: unknown): ValidationResult<AiMessageInput> {
  if (!isRecord(input)) {
    return { success: false, issues: [{ message: "Request body must be an object." }] };
  }

  const issues = validateString(input.message, {
    field: "message",
    label: "Message",
    required: true,
    minLength: 1,
    maxLength: 4000,
  });

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      message: sanitizePlainText(String(input.message)),
    },
    issues: [],
  };
}