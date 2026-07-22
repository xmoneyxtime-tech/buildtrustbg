import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { StripeBillingService, parsePlanCode, parsePlanInterval } from "@/app/lib/payments";
import { getCompanyForUser } from "@/app/lib/services/ownership";
import { invalidJsonResponse } from "@/app/lib/validation/http";

type CheckoutBody = {
  planCode?: string;
  billingInterval?: string;
};

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

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return invalidJsonResponse();
  }

  try {
    const origin = new URL(request.url).origin;
    const billingService = new StripeBillingService();
    const result = await billingService.createSubscriptionCheckoutSession({
      companyId: company.id,
      planCode: parsePlanCode(body.planCode),
      billingInterval: parsePlanInterval(body.billingInterval),
      successUrl: `${origin}/company/dashboard/subscription`,
      cancelUrl: `${origin}/company/dashboard/subscription`,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}