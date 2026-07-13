import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";
import { findUserByEmail, setReviewReaction, validateReactionInput } from "@/app/lib/reviews";
import type { SetReviewReactionInput } from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const rateLimited = enforceRateLimit(request, "reviewReaction");
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

  let body: SetReviewReactionInput;

  try {
    body = (await request.json()) as SetReviewReactionInput;
  } catch {
    return invalidJsonResponse();
  }

  const errors = validateReactionInput(body);

  if (errors.length > 0) {
    return validationErrorResponse(errors);
  }

  const { id } = await context.params;
  await setReviewReaction(id, user.id, body);

  return NextResponse.json({ success: true }, { status: 200 });
}
