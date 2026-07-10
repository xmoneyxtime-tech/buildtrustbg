import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listAdminReviews } from "@/app/lib/reviews";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await listAdminReviews();

  return NextResponse.json(result, { status: 200 });
}
