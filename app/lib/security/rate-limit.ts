import { NextResponse } from "next/server";

type RateLimitPolicy = {
  limit: number;
  windowMs: number;
};

type RateLimitPolicyKey =
  | "login"
  | "register"
  | "companyApplication"
  | "ai"
  | "reviews"
  | "reviewReport"
  | "reviewReaction"
  | "companyReviewReply"
  | "companyProjectWrite";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const RATE_LIMIT_POLICIES: Record<RateLimitPolicyKey, RateLimitPolicy> = {
  login: { limit: 8, windowMs: 60 * 1000 },
  register: { limit: 5, windowMs: 10 * 60 * 1000 },
  companyApplication: { limit: 5, windowMs: 10 * 60 * 1000 },
  ai: { limit: 20, windowMs: 60 * 1000 },
  reviews: { limit: 10, windowMs: 10 * 60 * 1000 },
  reviewReport: { limit: 20, windowMs: 10 * 60 * 1000 },
  reviewReaction: { limit: 60, windowMs: 60 * 1000 },
  companyReviewReply: { limit: 20, windowMs: 10 * 60 * 1000 },
  companyProjectWrite: { limit: 30, windowMs: 10 * 60 * 1000 },
};

const globalRateLimitStore = globalThis as unknown as {
  __buildtrustbgRateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalRateLimitStore.__buildtrustbgRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalRateLimitStore.__buildtrustbgRateLimitStore) {
  globalRateLimitStore.__buildtrustbgRateLimitStore = store;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const headersToCheck = ["x-real-ip", "cf-connecting-ip", "true-client-ip"];

  for (const header of headersToCheck) {
    const value = request.headers.get(header)?.trim();
    if (value) {
      return value;
    }
  }

  return "unknown";
}

function consumeRateLimit(key: string, policy: RateLimitPolicy): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + policy.windowMs;
    store.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      limit: policy.limit,
      remaining: Math.max(policy.limit - 1, 0),
      resetAt,
      retryAfterSeconds: Math.max(Math.ceil(policy.windowMs / 1000), 1),
    };
  }

  if (current.count >= policy.limit) {
    return {
      allowed: false,
      limit: policy.limit,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
    };
  }

  current.count += 1;

  return {
    allowed: true,
    limit: policy.limit,
    remaining: Math.max(policy.limit - current.count, 0),
    resetAt: current.resetAt,
    retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
  };
}

function toRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    "Retry-After": String(result.retryAfterSeconds),
  };
}

export function enforceRateLimit(
  request: Request,
  policyKey: RateLimitPolicyKey,
  customIdentifier?: string
): NextResponse | null {
  const policy = RATE_LIMIT_POLICIES[policyKey];
  const identifier = customIdentifier || getClientIp(request);
  const storageKey = `${policyKey}:${identifier}`;
  const result = consumeRateLimit(storageKey, policy);

  if (result.allowed) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
    },
    {
      status: 429,
      headers: toRateLimitHeaders(result),
    }
  );
}

export { RATE_LIMIT_POLICIES };
