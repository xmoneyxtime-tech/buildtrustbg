import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail, setReviewReaction, validateReactionInput } from "@/app/lib/reviews";
import type { SetReviewReactionInput } from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const errors = validateReactionInput(body);

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const { id } = await context.params;
  await setReviewReaction(id, user.id, body);

  return NextResponse.json({ success: true }, { status: 200 });
}
