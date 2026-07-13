import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";
import {
  createReviewForCompany,
  findApprovedCompanyBySlug,
  findUserByEmail,
  listPublicCompanyReviews,
  sanitizeCreateReviewInput,
  validateCreateReviewInput,
  validateReviewQuery,
} from "@/app/lib/reviews";
import type { CreateReviewInput } from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const company = await findApprovedCompanyBySlug(slug);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const query = validateReviewQuery({
    page: Number(url.searchParams.get("page") || "1"),
    pageSize: Number(url.searchParams.get("pageSize") || "10"),
    stars: Number(url.searchParams.get("stars") || "0") || undefined,
    sort: (url.searchParams.get("sort") as "latest" | "highest" | "lowest" | null) || undefined,
  });

  const result = await listPublicCompanyReviews(company.id, query);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request, context: RouteContext) {
  const rateLimited = enforceRateLimit(request, "reviews");
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

  const { slug } = await context.params;
  const company = await findApprovedCompanyBySlug(slug);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let body: CreateReviewInput;

  try {
    body = (await request.json()) as CreateReviewInput;
  } catch {
    return invalidJsonResponse();
  }

  const errors = validateCreateReviewInput(body);

  if (errors.length > 0) {
    return validationErrorResponse(errors);
  }

  try {
    const review = await createReviewForCompany(company.id, user.id, sanitizeCreateReviewInput(body));
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create review.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
