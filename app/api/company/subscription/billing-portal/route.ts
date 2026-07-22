import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { StripeBillingService } from "@/app/lib/payments";
import { getCompanyForUser } from "@/app/lib/services/ownership";

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getCompanyForUser({ userId, email });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  try {
    const origin = new URL(request.url).origin;
    const billingService = new StripeBillingService();
    const result = await billingService.createBillingPortalSession({
      companyId: company.id,
      returnUrl: `${origin}/company/dashboard/subscription`,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create billing portal session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}