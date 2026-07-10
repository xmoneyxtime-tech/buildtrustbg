import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteReviewReply,
  findCompanyOwnerByEmail,
  findUserByEmail,
  sanitizeReviewReplyInput,
  upsertReviewReply,
  validateReviewReplyInput,
} from "@/app/lib/reviews";
import type { UpdateReviewReplyInput } from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [company, user] = await Promise.all([
    findCompanyOwnerByEmail(email),
    findUserByEmail(email),
  ]);

  if (!company || !user) {
    return NextResponse.json({ error: "Company owner not found" }, { status: 404 });
  }

  let body: UpdateReviewReplyInput;

  try {
    body = (await request.json()) as UpdateReviewReplyInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const errors = validateReviewReplyInput(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const { id } = await context.params;
  const review = await upsertReviewReply(company.id, id, user.id, sanitizeReviewReplyInput(body));

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review }, { status: 200 });
}

export async function PATCH(request: Request, context: RouteContext) {
  return POST(request, context);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyOwnerByEmail(email);

  if (!company) {
    return NextResponse.json({ error: "Company owner not found" }, { status: 404 });
  }

  const { id } = await context.params;
  const deleted = await deleteReviewReply(company.id, id);

  if (!deleted) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
