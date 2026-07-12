import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";
import {
  createReviewReport,
  findUserByEmail,
  sanitizeReviewReportInput,
  validateReviewReportInput,
} from "@/app/lib/reviews";
import type { CreateReviewReportInput } from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const rateLimited = enforceRateLimit(request, "reviewReport");
  if (rateLimited) {
    return rateLimited;
  }

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body: CreateReviewReportInput;

  try {
    body = (await request.json()) as CreateReviewReportInput;
  } catch {
    return invalidJsonResponse();
  }

  const errors = validateReviewReportInput(body);

  if (errors.length > 0) {
    return validationErrorResponse(errors);
  }

  const { id } = await context.params;

  try {
    await createReviewReport(id, user.id, sanitizeReviewReportInput(body));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to report review.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
