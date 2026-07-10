import { NextResponse } from "next/server";
import type { ReviewModerationAction, ReviewStatus } from "@prisma/client";
import { auth } from "@/auth";
import {
  findUserByEmail,
  moderateReview,
  validateAdminModerationInput,
} from "@/app/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ModeratePayload = {
  action: ReviewModerationAction;
  status: ReviewStatus;
  reason?: string;
};

const ACTIONS: ReviewModerationAction[] = [
  "APPROVE",
  "HIDE",
  "DELETE",
  "RESTORE",
  "FLAG",
  "REPORT_RESOLVED",
  "REPORT_REJECTED",
];

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  const email = session?.user?.email;

  if (!session?.user || session.user.role !== "ADMIN" || !email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await findUserByEmail(email);

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  let body: ModeratePayload;

  try {
    body = (await request.json()) as ModeratePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!ACTIONS.includes(body.action)) {
    return NextResponse.json({ error: "Invalid moderation action" }, { status: 400 });
  }

  if (!validateAdminModerationInput(body.status)) {
    return NextResponse.json({ error: "Invalid target status" }, { status: 400 });
  }

  const { id } = await context.params;
  const review = await moderateReview(id, admin.id, body.action, body.status, body.reason);

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review }, { status: 200 });
}
