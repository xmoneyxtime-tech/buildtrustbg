import { handlers } from "@/auth";
import type { NextRequest } from "next/server";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";

type RouteContext = {
	params: Promise<{ nextauth?: string[] }>;
};

export const GET = handlers.GET;

function isCredentialsLoginAction(nextauth: string[]): boolean {
	const normalized = nextauth.map((item) => item.toLowerCase());
	return (
		normalized.join("/") === "callback/credentials" ||
		normalized.join("/") === "signin/credentials"
	);
}

export async function POST(request: NextRequest, context: RouteContext) {
	const { nextauth = [] } = await context.params;

	if (isCredentialsLoginAction(nextauth)) {
		const rateLimited = enforceRateLimit(request, "login");
		if (rateLimited) {
			return rateLimited;
		}
	}

	return handlers.POST(request);
}