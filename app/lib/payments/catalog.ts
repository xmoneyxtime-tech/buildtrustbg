import { PlanInterval, ProductType, type PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

const CURRENCY = "EUR" as const;

export type SubscriptionPlanCode = "starter" | "premium" | "gold";
export type SubscriptionBillingInterval = "monthly" | "yearly";

type CatalogSeed = {
  planCode: SubscriptionPlanCode;
  billingInterval: SubscriptionBillingInterval;
  name: string;
  description: string;
  priceMinor: number;
  sortOrder: number;
};

export type CatalogEntry = CatalogSeed & {
  interval: PlanInterval;
  code: string;
  productCode: string;
};

export type EnsuredCatalogEntry = CatalogEntry & {
  planId: string;
  productId: string;
  currency: typeof CURRENCY;
};

type PrismaLike = PrismaClient | Prisma.TransactionClient;

const CATALOG: readonly CatalogEntry[] = [
  {
    planCode: "starter",
    billingInterval: "monthly",
    interval: PlanInterval.MONTHLY,
    code: "starter-monthly",
    productCode: "starter-monthly-subscription",
    name: "Starter",
    description: "Starter subscription for verified company presence.",
    priceMinor: 999,
    sortOrder: 10,
  },
  {
    planCode: "premium",
    billingInterval: "monthly",
    interval: PlanInterval.MONTHLY,
    code: "premium-monthly",
    productCode: "premium-monthly-subscription",
    name: "Premium",
    description: "Premium monthly subscription.",
    priceMinor: 4999,
    sortOrder: 20,
  },
  {
    planCode: "premium",
    billingInterval: "yearly",
    interval: PlanInterval.YEARLY,
    code: "premium-yearly",
    productCode: "premium-yearly-subscription",
    name: "Premium",
    description: "Premium annual subscription.",
    priceMinor: 49900,
    sortOrder: 21,
  },
  {
    planCode: "gold",
    billingInterval: "monthly",
    interval: PlanInterval.MONTHLY,
    code: "gold-monthly",
    productCode: "gold-monthly-subscription",
    name: "Gold",
    description: "Gold monthly subscription.",
    priceMinor: 9999,
    sortOrder: 30,
  },
  {
    planCode: "gold",
    billingInterval: "yearly",
    interval: PlanInterval.YEARLY,
    code: "gold-yearly",
    productCode: "gold-yearly-subscription",
    name: "Gold",
    description: "Gold annual subscription.",
    priceMinor: 99900,
    sortOrder: 31,
  },
] as const;

export function getCatalogEntry(
  planCode: SubscriptionPlanCode,
  billingInterval: SubscriptionBillingInterval
): CatalogEntry {
  const entry = CATALOG.find(
    (item) => item.planCode === planCode && item.billingInterval === billingInterval
  );

  if (!entry) {
    throw new Error(`Unsupported subscription plan: ${planCode}/${billingInterval}`);
  }

  return entry;
}

export async function ensureCatalogEntry(
  db: PrismaLike,
  planCode: SubscriptionPlanCode,
  billingInterval: SubscriptionBillingInterval
): Promise<EnsuredCatalogEntry> {
  const entry = getCatalogEntry(planCode, billingInterval);

  const plan = await db.plan.upsert({
    where: {
      code: entry.code,
    },
    update: {
      name: entry.name,
      description: entry.description,
      interval: entry.interval,
      currency: CURRENCY,
      priceMinor: entry.priceMinor,
      isActive: true,
      sortOrder: entry.sortOrder,
    },
    create: {
      code: entry.code,
      name: entry.name,
      description: entry.description,
      interval: entry.interval,
      currency: CURRENCY,
      priceMinor: entry.priceMinor,
      isActive: true,
      sortOrder: entry.sortOrder,
    },
    select: {
      id: true,
    },
  });

  const product = await db.product.upsert({
    where: {
      code: entry.productCode,
    },
    update: {
      name: `${entry.name} ${entry.billingInterval === "yearly" ? "Yearly" : "Monthly"}`,
      description: entry.description,
      type: ProductType.SUBSCRIPTION,
      currency: CURRENCY,
      priceMinor: entry.priceMinor,
      planId: plan.id,
      isActive: true,
    },
    create: {
      code: entry.productCode,
      name: `${entry.name} ${entry.billingInterval === "yearly" ? "Yearly" : "Monthly"}`,
      description: entry.description,
      type: ProductType.SUBSCRIPTION,
      currency: CURRENCY,
      priceMinor: entry.priceMinor,
      planId: plan.id,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  return {
    ...entry,
    planId: plan.id,
    productId: product.id,
    currency: CURRENCY,
  };
}

export function parsePlanInterval(value: string | null | undefined): SubscriptionBillingInterval {
  if (value === "monthly" || value === "yearly") {
    return value;
  }

  throw new Error(`Invalid billing interval: ${value ?? "missing"}`);
}

export function parsePlanCode(value: string | null | undefined): SubscriptionPlanCode {
  if (value === "starter" || value === "premium" || value === "gold") {
    return value;
  }

  throw new Error(`Invalid plan code: ${value ?? "missing"}`);
}