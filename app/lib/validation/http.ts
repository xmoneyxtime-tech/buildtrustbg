import { NextResponse } from "next/server";
import { normalizeIssueMessages, type ValidationIssue } from "./core";

export function validationErrorResponse(
  issues: Array<string | ValidationIssue>,
  extras?: Record<string, unknown>
) {
  const details = normalizeIssueMessages(issues);

  return NextResponse.json(
    {
      error: "Validation failed.",
      details,
      ...extras,
    },
    { status: 400 }
  );
}

export function invalidJsonResponse() {
  return validationErrorResponse(["Request body must be valid JSON."]);
}
