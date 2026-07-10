import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findCompanyOwnerByEmail, listCompanyReviews } from "@/app/lib/reviews";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyOwnerByEmail(email);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const result = await listCompanyReviews(company.id);

  return NextResponse.json(result, { status: 200 });
}
