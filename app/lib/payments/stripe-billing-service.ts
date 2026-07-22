import {
  InvoiceStatus,
  PaymentProvider,
  PaymentProviderEventStatus,
  PaymentStatus,
  StoredPaymentMethodStatus,
  StoredPaymentMethodType,
  SubscriptionStatus,
  type Prisma,
} from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { assertSupportedCurrency, getStripeConfig } from "./config";
import {
  ensureCatalogEntry,
  parsePlanCode,
  parsePlanInterval,
  type SubscriptionBillingInterval,
  type SubscriptionPlanCode,
} from "./catalog";

const STRIPE_PROVIDER = PaymentProvider.STRIPE;
const ACTIVE_COMPANY_STATUSES = new Set<SubscriptionStatus>([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
]);

export type CreateSubscriptionCheckoutInput = {
  companyId: string;
  planCode: SubscriptionPlanCode;
  billingInterval: SubscriptionBillingInterval;
  successUrl: string;
  cancelUrl: string;
};

export type CreateSubscriptionCheckoutResult = {
  providerCheckoutSessionId: string;
  checkoutUrl: string;
};

export type CreateBillingPortalSessionInput = {
  companyId: string;
  returnUrl: string;
};

export type CreateBillingPortalSessionResult = {
  portalUrl: string;
};

type EventResolution = {
  companyId?: string;
  paymentId?: string;
  orderId?: string;
  subscriptionId?: string;
};

type StripeMetadata = {
  companyId?: string;
  localPlanId?: string;
  localProductId?: string;
  localSubscriptionId?: string;
  planCode?: string;
  billingInterval?: string;
};

export class StripeBillingService {
  private readonly client: Stripe;
  private readonly webhookSecret?: string;

  constructor() {
    const config = getStripeConfig();
    this.client = new Stripe(config.secretKey);
    this.webhookSecret = config.webhookSecret;
  }

  async createSubscriptionCheckoutSession(
    input: CreateSubscriptionCheckoutInput
  ): Promise<CreateSubscriptionCheckoutResult> {
    assertUrl(input.successUrl, "successUrl");
    assertUrl(input.cancelUrl, "cancelUrl");

    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "CompanyApplication" WHERE id = ${input.companyId} FOR UPDATE`;

      const company = await tx.companyApplication.findUnique({
        where: { id: input.companyId },
        select: { id: true, companyName: true, email: true },
      });

      if (!company) {
        throw new Error("Company not found.");
      }

      const catalog = await ensureCatalogEntry(tx, input.planCode, input.billingInterval);
      assertSupportedCurrency(catalog.currency);

      const activeSubscription = await tx.subscription.findFirst({
        where: {
          companyId: company.id,
          status: {
            in: [SubscriptionStatus.PENDING, SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE],
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          payments: {
            where: {
              provider: STRIPE_PROVIDER,
              status: PaymentStatus.PENDING,
              providerPaymentId: {
                not: null,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      });

      if (activeSubscription?.status === SubscriptionStatus.PENDING && activeSubscription.payments[0]?.providerPaymentId) {
        return this.getCheckoutSession(activeSubscription.payments[0].providerPaymentId);
      }

      if (activeSubscription && activeSubscription.status !== SubscriptionStatus.PENDING) {
        throw new Error("An active subscription already exists. Use the billing portal to manage it.");
      }

      const customerId = await findCompanyStripeCustomerId(tx, company.id);

      const subscription =
        activeSubscription ??
        (await tx.subscription.create({
          data: {
            companyId: company.id,
            planId: catalog.planId,
            planName: catalog.name,
            billingInterval: catalog.interval,
            currency: catalog.currency,
            priceAmount: catalog.priceMinor,
            status: SubscriptionStatus.PENDING,
          },
        }));

      const metadata = {
        companyId: company.id,
        localPlanId: catalog.planId,
        localProductId: catalog.productId,
        localSubscriptionId: subscription.id,
        planCode: catalog.planCode,
        billingInterval: catalog.billingInterval,
      } satisfies Record<string, string>;

      const session = await this.client.checkout.sessions.create({
        mode: "subscription",
        success_url: appendCheckoutState(input.successUrl, "subscription_active"),
        cancel_url: input.cancelUrl,
        client_reference_id: company.id,
        ...(customerId ? { customer: customerId } : { customer_email: company.email }),
        allow_promotion_codes: true,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: catalog.currency.toLowerCase(),
              unit_amount: catalog.priceMinor,
              recurring: {
                interval: catalog.billingInterval === "yearly" ? "year" : "month",
              },
              product_data: {
                name: `${catalog.name} ${catalog.billingInterval === "yearly" ? "Yearly" : "Monthly"}`,
                description: catalog.description,
                metadata: {
                  productId: catalog.productId,
                  planId: catalog.planId,
                },
              },
            },
          },
        ],
        metadata,
        subscription_data: {
          metadata,
        },
      });

      if (!session.url) {
        throw new Error("Stripe checkout session did not return a URL.");
      }

      await tx.payment.create({
        data: {
          companyId: company.id,
          subscriptionId: subscription.id,
          provider: STRIPE_PROVIDER,
          providerPaymentId: session.id,
          providerCustomerId: toId(session.customer) ?? customerId ?? undefined,
          status: PaymentStatus.PENDING,
          method: "CARD",
          currency: catalog.currency,
          amountMinor: catalog.priceMinor,
        },
      });

      return {
        providerCheckoutSessionId: session.id,
        checkoutUrl: session.url,
      };
    });
  }

  async getCheckoutSession(providerCheckoutSessionId: string): Promise<CreateSubscriptionCheckoutResult> {
    const session = await this.client.checkout.sessions.retrieve(providerCheckoutSessionId);

    if (!session.url) {
      throw new Error(`Stripe checkout session ${providerCheckoutSessionId} does not have a URL.`);
    }

    return {
      providerCheckoutSessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async createBillingPortalSession(
    input: CreateBillingPortalSessionInput
  ): Promise<CreateBillingPortalSessionResult> {
    assertUrl(input.returnUrl, "returnUrl");

    const customerId = await prisma.payment.findFirst({
      where: {
        companyId: input.companyId,
        provider: STRIPE_PROVIDER,
        providerCustomerId: {
          not: null,
        },
      },
      orderBy: [
        { paidAt: "desc" },
        { updatedAt: "desc" },
      ],
      select: {
        providerCustomerId: true,
      },
    });

    if (!customerId?.providerCustomerId) {
      throw new Error("Stripe customer not found for company.");
    }

    const session = await this.client.billingPortal.sessions.create({
      customer: customerId.providerCustomerId,
      return_url: input.returnUrl,
    });

    return {
      portalUrl: session.url,
    };
  }

  constructWebhookEvent(payload: string, signature: string): Stripe.Event {
    if (!this.webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is required for Stripe webhooks.");
    }

    return this.client.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    const existing = await prisma.paymentProviderEvent.findUnique({
      where: {
        provider_providerEventId: {
          provider: STRIPE_PROVIDER,
          providerEventId: event.id,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existing && (existing.status === PaymentProviderEventStatus.PROCESSED || existing.status === PaymentProviderEventStatus.IGNORED)) {
      return;
    }

    const eventRecord =
      existing ??
      (await prisma.paymentProviderEvent.create({
        data: {
          provider: STRIPE_PROVIDER,
          providerEventId: event.id,
          eventType: event.type,
          payload: event as unknown as Prisma.InputJsonValue,
          status: PaymentProviderEventStatus.RECEIVED,
        },
      }));

    try {
      const resolution = await this.processWebhookEvent(event);

      await prisma.paymentProviderEvent.update({
        where: { id: eventRecord.id },
        data: {
          status: PaymentProviderEventStatus.PROCESSED,
          processedAt: new Date(),
          companyId: resolution.companyId,
          paymentId: resolution.paymentId,
          orderId: resolution.orderId,
          subscriptionId: resolution.subscriptionId,
          errorMessage: null,
        },
      });
    } catch (error) {
      await prisma.paymentProviderEvent.update({
        where: { id: eventRecord.id },
        data: {
          status: PaymentProviderEventStatus.FAILED,
          processedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : "Unknown webhook processing error.",
        },
      });

      throw error;
    }
  }

  private async processWebhookEvent(event: Stripe.Event): Promise<EventResolution> {
    switch (event.type) {
      case "checkout.session.completed":
        return this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      case "payment_intent.succeeded":
        return this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      case "invoice.paid":
        return this.handleInvoicePaid(event.data.object as Stripe.Invoice);
      case "invoice.payment_failed":
        return this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      default:
        await prisma.paymentProviderEvent.updateMany({
          where: {
            provider: STRIPE_PROVIDER,
            providerEventId: event.id,
          },
          data: {
            status: PaymentProviderEventStatus.IGNORED,
            processedAt: new Date(),
            errorMessage: null,
          },
        });
        return {};
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<EventResolution> {
    const metadata = readMetadata(session.metadata);
    const stripeSubscriptionId = toId(session.subscription);

    const stripeSubscription = stripeSubscriptionId
      ? await this.client.subscriptions.retrieve(stripeSubscriptionId)
      : null;

    return prisma.$transaction(async (tx) => {
      const subscription = stripeSubscription
        ? await this.upsertSubscriptionFromStripe(tx, stripeSubscription, metadata)
        : await this.ensureSubscriptionFromMetadata(tx, metadata);

      const payment = await upsertPaymentRecord(tx, {
        companyId: subscription.companyId,
        subscriptionId: subscription.id,
        stripePaymentId: toId(session.payment_intent) ?? session.id,
        stripeCustomerId: toId(session.customer),
        stripeSubscriptionId: stripeSubscriptionId ?? undefined,
        amountMinor: subscription.priceAmount,
        currency: subscription.currency,
        status: session.payment_status === "paid" ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
        paidAt: session.payment_status === "paid" ? new Date() : undefined,
      });

      await tx.companyApplication.update({
        where: { id: subscription.companyId },
        data: {
          activeSubscription: true,
        },
      });

      return {
        companyId: subscription.companyId,
        paymentId: payment.id,
        subscriptionId: subscription.id,
      };
    });
  }

  private async handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent): Promise<EventResolution> {
    const paymentIntent = intent as Stripe.PaymentIntent & { invoice?: unknown };
    const paymentMethodId = toId(paymentIntent.payment_method);
    const invoiceId = toId(paymentIntent.invoice);
    const paymentMethod = paymentMethodId
      ? await this.client.paymentMethods.retrieve(paymentMethodId)
      : null;

    return prisma.$transaction(async (tx) => {
      const invoice = invoiceId
        ? await tx.invoice.findUnique({
            where: {
              providerInvoiceId: invoiceId,
            },
            select: {
              id: true,
              companyId: true,
              subscriptionId: true,
            },
          })
        : null;

      const payment = await upsertPaymentRecord(tx, {
        companyId: invoice?.companyId,
        subscriptionId: invoice?.subscriptionId ?? undefined,
        invoiceId: invoice?.id,
        stripePaymentId: intent.id,
        stripeCustomerId: toId(intent.customer),
        stripeSubscriptionId: undefined,
        amountMinor: intent.amount_received || intent.amount,
        currency: (intent.currency ?? "EUR").toUpperCase(),
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      });

      let storedPaymentMethodId: string | undefined;

      if (paymentMethod && payment.companyId) {
        storedPaymentMethodId = await this.upsertStoredPaymentMethod(tx, payment.companyId, toId(intent.customer), paymentMethod);
      }

      if (storedPaymentMethodId) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { storedPaymentMethodId },
        });
      }

      return {
        companyId: payment.companyId,
        paymentId: payment.id,
        subscriptionId: payment.subscriptionId ?? undefined,
      };
    });
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<EventResolution> {
    const stripeInvoice = invoice as Stripe.Invoice & {
      subscription?: unknown;
      payment_intent?: unknown;
      tax?: number | null;
    };
    const subscription = await this.resolveStripeSubscriptionFromInvoice(stripeInvoice);

    return prisma.$transaction(async (tx) => {
      const localSubscription = subscription
        ? await this.upsertSubscriptionFromStripe(tx, subscription, readMetadata(subscription.metadata))
        : await this.resolveExistingSubscriptionByStripeId(tx, toId(stripeInvoice.subscription));

      if (!localSubscription) {
        throw new Error("Unable to resolve subscription for paid invoice.");
      }

      const localInvoice = await this.upsertInvoiceFromStripe(tx, invoice, localSubscription.companyId, localSubscription.id);
      const payment = await upsertPaymentRecord(tx, {
        companyId: localSubscription.companyId,
        subscriptionId: localSubscription.id,
        invoiceId: localInvoice.id,
        stripePaymentId: toId(stripeInvoice.payment_intent) ?? invoice.id,
        stripeCustomerId: toId(invoice.customer),
        stripeSubscriptionId: localSubscription.providerSubscriptionId ?? undefined,
        amountMinor: invoice.amount_paid || invoice.total,
        currency: (invoice.currency ?? localSubscription.currency).toUpperCase(),
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      });

      await tx.companyApplication.update({
        where: { id: localSubscription.companyId },
        data: {
          activeSubscription: true,
        },
      });

      return {
        companyId: localSubscription.companyId,
        paymentId: payment.id,
        subscriptionId: localSubscription.id,
      };
    });
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<EventResolution> {
    const stripeInvoice = invoice as Stripe.Invoice & {
      subscription?: unknown;
      payment_intent?: unknown;
      tax?: number | null;
    };
    const subscription = await this.resolveStripeSubscriptionFromInvoice(stripeInvoice);

    return prisma.$transaction(async (tx) => {
      const localSubscription = subscription
        ? await this.upsertSubscriptionFromStripe(tx, subscription, readMetadata(subscription.metadata))
        : await this.resolveExistingSubscriptionByStripeId(tx, toId(stripeInvoice.subscription));

      if (!localSubscription) {
        throw new Error("Unable to resolve subscription for failed invoice.");
      }

      const localInvoice = await this.upsertInvoiceFromStripe(tx, invoice, localSubscription.companyId, localSubscription.id);
      const payment = await upsertPaymentRecord(tx, {
        companyId: localSubscription.companyId,
        subscriptionId: localSubscription.id,
        invoiceId: localInvoice.id,
        stripePaymentId: toId(stripeInvoice.payment_intent) ?? invoice.id,
        stripeCustomerId: toId(invoice.customer),
        stripeSubscriptionId: localSubscription.providerSubscriptionId ?? undefined,
        amountMinor: invoice.amount_due || invoice.total,
        currency: (invoice.currency ?? localSubscription.currency).toUpperCase(),
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
      });

      await tx.companyApplication.update({
        where: { id: localSubscription.companyId },
        data: {
          activeSubscription: true,
        },
      });

      return {
        companyId: localSubscription.companyId,
        paymentId: payment.id,
        subscriptionId: localSubscription.id,
      };
    });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<EventResolution> {
    return prisma.$transaction(async (tx) => {
      const localSubscription = await this.upsertSubscriptionFromStripe(tx, subscription, readMetadata(subscription.metadata));
      await tx.companyApplication.update({
        where: { id: localSubscription.companyId },
        data: {
          activeSubscription: ACTIVE_COMPANY_STATUSES.has(localSubscription.status),
        },
      });

      return {
        companyId: localSubscription.companyId,
        subscriptionId: localSubscription.id,
      };
    });
  }

  private async ensureSubscriptionFromMetadata(
    tx: Prisma.TransactionClient,
    metadata: StripeMetadata
  ) {
    const subscriptionId = metadata.localSubscriptionId?.trim();

    if (subscriptionId) {
      const existing = await tx.subscription.findUnique({ where: { id: subscriptionId } });
      if (existing) {
        return existing;
      }
    }

    const companyId = metadata.companyId?.trim();
    if (!companyId) {
      throw new Error("Missing companyId in Stripe metadata.");
    }

    const catalog = await ensureCatalogEntry(
      tx,
      parsePlanCode(metadata.planCode),
      parsePlanInterval(metadata.billingInterval)
    );

    return tx.subscription.create({
      data: {
        companyId,
        planId: catalog.planId,
        planName: catalog.name,
        billingInterval: catalog.interval,
        currency: catalog.currency,
        priceAmount: catalog.priceMinor,
        status: SubscriptionStatus.PENDING,
      },
    });
  }

  private async resolveExistingSubscriptionByStripeId(
    tx: Prisma.TransactionClient,
    stripeSubscriptionId: string | null | undefined
  ) {
    if (!stripeSubscriptionId) {
      return null;
    }

    return tx.subscription.findUnique({
      where: {
        providerSubscriptionId: stripeSubscriptionId,
      },
    });
  }

  private async upsertSubscriptionFromStripe(
    tx: Prisma.TransactionClient,
    stripeSubscription: Stripe.Subscription,
    metadata: StripeMetadata
  ) {
    const companyId = metadata.companyId?.trim();
    if (!companyId) {
      throw new Error("Stripe subscription metadata is missing companyId.");
    }

    const planCode = parsePlanCode(metadata.planCode);
    const billingInterval = parsePlanInterval(metadata.billingInterval);
    const catalog = await ensureCatalogEntry(tx, planCode, billingInterval);
    const currentPeriod = getCurrentPeriod(stripeSubscription);
    const status = mapStripeSubscriptionStatus(stripeSubscription.status);

    return tx.subscription.upsert({
      where: {
        providerSubscriptionId: stripeSubscription.id,
      },
      update: {
        companyId,
        planId: catalog.planId,
        planName: catalog.name,
        billingInterval: catalog.interval,
        currency: catalog.currency,
        priceAmount: catalog.priceMinor,
        status,
        startsAt: fromUnix(stripeSubscription.start_date) ?? new Date(),
        currentPeriodStart: currentPeriod.start,
        currentPeriodEnd: currentPeriod.end,
        canceledAt: stripeSubscription.canceled_at ? fromUnix(stripeSubscription.canceled_at) : null,
      },
      create: {
        companyId,
        planId: catalog.planId,
        providerSubscriptionId: stripeSubscription.id,
        planName: catalog.name,
        billingInterval: catalog.interval,
        currency: catalog.currency,
        priceAmount: catalog.priceMinor,
        status,
        startsAt: fromUnix(stripeSubscription.start_date) ?? new Date(),
        currentPeriodStart: currentPeriod.start,
        currentPeriodEnd: currentPeriod.end,
        canceledAt: stripeSubscription.canceled_at ? fromUnix(stripeSubscription.canceled_at) : null,
      },
    });
  }

  private async upsertInvoiceFromStripe(
    tx: Prisma.TransactionClient,
    invoice: Stripe.Invoice,
    companyId: string,
    subscriptionId: string
  ) {
    const stripeInvoice = invoice as Stripe.Invoice & { tax?: number | null };
    const currency = (invoice.currency ?? "EUR").toUpperCase();
    assertSupportedCurrency(currency);

    return tx.invoice.upsert({
      where: {
        providerInvoiceId: invoice.id,
      },
      update: {
        companyId,
        subscriptionId,
        number: invoice.number ?? `stripe-${invoice.id}`,
        status: mapStripeInvoiceStatus(invoice),
        currency,
        subtotalMinor: invoice.subtotal,
        discountMinor: invoice.total_discount_amounts?.reduce((sum, item) => sum + item.amount, 0) ?? 0,
        taxMinor: stripeInvoice.tax ?? 0,
        totalMinor: invoice.total,
        pdfUrl: invoice.invoice_pdf ?? null,
        issuedAt: fromUnix(invoice.status_transitions.finalized_at) ?? fromUnix(invoice.created),
        dueAt: fromUnix(invoice.due_date),
        paidAt: fromUnix(invoice.status_transitions.paid_at),
      },
      create: {
        companyId,
        subscriptionId,
        providerInvoiceId: invoice.id,
        number: invoice.number ?? `stripe-${invoice.id}`,
        status: mapStripeInvoiceStatus(invoice),
        currency,
        subtotalMinor: invoice.subtotal,
        discountMinor: invoice.total_discount_amounts?.reduce((sum, item) => sum + item.amount, 0) ?? 0,
        taxMinor: stripeInvoice.tax ?? 0,
        totalMinor: invoice.total,
        pdfUrl: invoice.invoice_pdf ?? null,
        issuedAt: fromUnix(invoice.status_transitions.finalized_at) ?? fromUnix(invoice.created),
        dueAt: fromUnix(invoice.due_date),
        paidAt: fromUnix(invoice.status_transitions.paid_at),
      },
    });
  }

  private async resolveStripeSubscriptionFromInvoice(invoice: Stripe.Invoice & { subscription?: unknown }) {
    const subscriptionId = toId(invoice.subscription);
    if (!subscriptionId) {
      return null;
    }

    return this.client.subscriptions.retrieve(subscriptionId);
  }

  private async upsertStoredPaymentMethod(
    tx: Prisma.TransactionClient,
    companyId: string,
    stripeCustomerId: string | null | undefined,
    paymentMethod: Stripe.PaymentMethod
  ) {
    if (!paymentMethod.card) {
      return undefined;
    }

    const type = mapStripePaymentMethodType(paymentMethod.type);
    const stored = await tx.storedPaymentMethod.upsert({
      where: {
        provider_providerPaymentMethodId: {
          provider: STRIPE_PROVIDER,
          providerPaymentMethodId: paymentMethod.id,
        },
      },
      update: {
        companyId,
        providerCustomerId: stripeCustomerId ?? undefined,
        type,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        status: StoredPaymentMethodStatus.ACTIVE,
      },
      create: {
        companyId,
        provider: STRIPE_PROVIDER,
        providerCustomerId: stripeCustomerId ?? undefined,
        providerPaymentMethodId: paymentMethod.id,
        type,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        isDefault: false,
        status: StoredPaymentMethodStatus.ACTIVE,
      },
      select: {
        id: true,
      },
    });

    return stored.id;
  }
}

async function findCompanyStripeCustomerId(tx: Prisma.TransactionClient, companyId: string): Promise<string | null> {
  const payment = await tx.payment.findFirst({
    where: {
      companyId,
      provider: STRIPE_PROVIDER,
      providerCustomerId: {
        not: null,
      },
    },
    orderBy: [{ paidAt: "desc" }, { updatedAt: "desc" }],
    select: {
      providerCustomerId: true,
    },
  });

  if (payment?.providerCustomerId) {
    return payment.providerCustomerId;
  }

  const stored = await tx.storedPaymentMethod.findFirst({
    where: {
      companyId,
      provider: STRIPE_PROVIDER,
      providerCustomerId: {
        not: null,
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      providerCustomerId: true,
    },
  });

  return stored?.providerCustomerId ?? null;
}

async function upsertPaymentRecord(
  tx: Prisma.TransactionClient,
  input: {
    companyId?: string;
    subscriptionId?: string;
    invoiceId?: string;
    stripePaymentId: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string;
    amountMinor: number;
    currency: string;
    status: PaymentStatus;
    paidAt?: Date;
    failedAt?: Date;
  }
) {
  const currency = input.currency.toUpperCase();
  assertSupportedCurrency(currency);

  const existing = await tx.payment.findFirst({
    where: {
      provider: STRIPE_PROVIDER,
      OR: [
        { providerPaymentId: input.stripePaymentId },
        ...(input.invoiceId ? [{ invoiceId: input.invoiceId }] : []),
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (existing) {
    return tx.payment.update({
      where: { id: existing.id },
      data: {
        companyId: input.companyId ?? existing.companyId,
        subscriptionId: input.subscriptionId ?? existing.subscriptionId ?? undefined,
        invoiceId: input.invoiceId ?? existing.invoiceId ?? undefined,
        providerPaymentId: input.stripePaymentId,
        providerCustomerId: input.stripeCustomerId ?? existing.providerCustomerId ?? undefined,
        providerSubscriptionId: input.stripeSubscriptionId ?? existing.providerSubscriptionId ?? undefined,
        amountMinor: input.amountMinor,
        currency,
        status: input.status,
        paidAt: input.paidAt ?? existing.paidAt,
        failedAt: input.failedAt ?? existing.failedAt,
      },
    });
  }

  if (!input.companyId) {
    throw new Error("companyId is required to create a payment record.");
  }

  return tx.payment.create({
    data: {
      companyId: input.companyId,
      subscriptionId: input.subscriptionId,
      invoiceId: input.invoiceId,
      provider: STRIPE_PROVIDER,
      providerPaymentId: input.stripePaymentId,
      providerCustomerId: input.stripeCustomerId ?? undefined,
      providerSubscriptionId: input.stripeSubscriptionId,
      status: input.status,
      method: "CARD",
      currency,
      amountMinor: input.amountMinor,
      paidAt: input.paidAt,
      failedAt: input.failedAt,
    },
  });
}

function mapStripePaymentMethodType(type: string): StoredPaymentMethodType {
  if (type === "card") {
    return StoredPaymentMethodType.CARD;
  }

  return StoredPaymentMethodType.OTHER;
}

function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
    case "unpaid":
    case "paused":
    case "incomplete":
    case "incomplete_expired":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    default:
      return SubscriptionStatus.PENDING;
  }
}

function mapStripeInvoiceStatus(invoice: Stripe.Invoice): InvoiceStatus {
  if (invoice.status === "paid") {
    return InvoiceStatus.PAID;
  }

  if (invoice.status === "void" || invoice.status === "uncollectible") {
    return InvoiceStatus.VOID;
  }

  if (invoice.status === "draft") {
    return InvoiceStatus.DRAFT;
  }

  return InvoiceStatus.ISSUED;
}

function getCurrentPeriod(subscription: Stripe.Subscription): { start: Date | null; end: Date | null } {
  const item = subscription.items.data[0];

  return {
    start: fromUnix(item?.current_period_start ?? null),
    end: fromUnix(item?.current_period_end ?? null),
  };
}

function readMetadata(metadata: Stripe.Metadata | null | undefined): StripeMetadata {
  return {
    companyId: metadata?.companyId,
    localPlanId: metadata?.localPlanId,
    localProductId: metadata?.localProductId,
    localSubscriptionId: metadata?.localSubscriptionId,
    planCode: metadata?.planCode,
    billingInterval: metadata?.billingInterval,
  };
}

function fromUnix(value: number | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(value * 1000);
}

function toId(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "id" in value && typeof value.id === "string") {
    return value.id;
  }

  return null;
}

function appendCheckoutState(url: string, state: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set("subscription", state);
  return parsed.toString();
}

function assertUrl(url: string, label: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error(`${label} must be an absolute URL.`);
  }
}