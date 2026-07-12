import { prisma } from "@/lib/prisma";

type OwnershipLookupInput = {
  userId?: string | null;
  email?: string | null;
};

export type OwnershipResolutionSource = "ownerId" | "email" | null;

export type OwnedCompany = {
  id: string;
  companyName: string;
  email: string;
  ownerId: string | null;
};

export type OwnershipResolution = {
  company: OwnedCompany | null;
  source: OwnershipResolutionSource;
};

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }

  const normalized = email.trim();
  return normalized.length > 0 ? normalized : null;
}

async function findCompanyByOwnerId(userId: string): Promise<OwnedCompany | null> {
  return prisma.companyApplication.findFirst({
    where: {
      ownerId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      companyName: true,
      email: true,
      ownerId: true,
    },
  });
}

async function findCompanyByEmail(email: string): Promise<OwnedCompany | null> {
  return prisma.companyApplication.findFirst({
    where: {
      email,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      companyName: true,
      email: true,
      ownerId: true,
    },
  });
}

/**
 * Resolves company ownership with dual-read strategy.
 *
 * Algorithm:
 * 1) Try ownerId when userId is provided.
 * 2) Fallback to email when ownerId has no match.
 */
export async function resolveCompanyOwnership(input: OwnershipLookupInput): Promise<OwnershipResolution> {
  const userId = input.userId?.trim();
  if (userId) {
    const ownerMatched = await findCompanyByOwnerId(userId);
    if (ownerMatched) {
      return {
        company: ownerMatched,
        source: "ownerId",
      };
    }
  }

  const email = normalizeEmail(input.email);
  if (!email) {
    return {
      company: null,
      source: null,
    };
  }

  const emailMatched = await findCompanyByEmail(email);
  return {
    company: emailMatched,
    source: emailMatched ? "email" : null,
  };
}

/**
 * Returns a company for a given user context, or null when no ownership exists.
 */
export async function getCompanyForUser(input: OwnershipLookupInput): Promise<OwnedCompany | null> {
  const resolution = await resolveCompanyOwnership(input);
  return resolution.company;
}

/**
 * Resolves and requires a company owner; throws when no company can be resolved.
 */
export async function requireCompanyOwner(input: OwnershipLookupInput): Promise<OwnedCompany> {
  const resolution = await resolveCompanyOwnership(input);
  if (!resolution.company) {
    throw new Error("Company owner not found.");
  }

  return resolution.company;
}
