import Stripe from "stripe";
import {
  type AttachProviderPaymentMethodInput,
  type CancelProviderPaymentInput,
  type CreateCheckoutSessionInput,
  type CreateCheckoutSessionResult,
  type CreateProviderCustomerInput,
  type CreateProviderCustomerResult,
  type CreateProviderPaymentInput,
  type CreateProviderPaymentResult,
  type PaymentProvider,
} from "../provider";
import { type StripeConfig } from "../config";

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const;
  private readonly client: Stripe;

  constructor(private readonly config: StripeConfig) {
    if (!this.config.secretKey || !this.config.publishableKey) {
      throw new Error("Invalid Stripe configuration.");
    }

    this.client = new Stripe(this.config.secretKey);
  }

  async createCustomer(_input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult> {
    throw new Error("Not implemented: StripeProvider.createCustomer");
  }

  async createPayment(_input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult> {
    throw new Error("Not implemented: StripeProvider.createPayment");
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult> {
    if (input.lineItems.length === 0) {
      throw new Error("Checkout requires at least one line item.");
    }

    // Apple Pay and Google Pay will be handled later by Stripe Checkout configuration.
    const session = await this.client.checkout.sessions.create(
      {
        mode: "payment",
        success_url: buildPendingSuccessUrl(input.successUrl),
        cancel_url: input.cancelUrl,
        line_items: input.lineItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: item.currency.toLowerCase(),
            unit_amount: item.unitAmountMinor,
            product_data: {
              name: item.name,
              ...(item.description ? { description: item.description } : {}),
              metadata: {
                productId: item.productId,
              },
            },
          },
        })),
        client_reference_id: input.orderId ?? input.companyId,
        metadata: toStripeMetadata({
          companyId: input.companyId,
          orderId: input.orderId,
          ...input.metadata,
        }),
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined
    );

    if (!session.url) {
      throw new Error("Stripe checkout session did not return a URL.");
    }

    return {
      providerCheckoutSessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async getCheckoutSession(providerCheckoutSessionId: string): Promise<CreateCheckoutSessionResult> {
    const session = await this.client.checkout.sessions.retrieve(providerCheckoutSessionId);

    if (!session.url) {
      throw new Error(`Stripe checkout session ${providerCheckoutSessionId} does not have a URL.`);
    }

    return {
      providerCheckoutSessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async attachPaymentMethod(_input: AttachProviderPaymentMethodInput): Promise<void> {
    throw new Error("Not implemented: StripeProvider.attachPaymentMethod");
  }

  async cancelPayment(_input: CancelProviderPaymentInput): Promise<void> {
    throw new Error("Not implemented: StripeProvider.cancelPayment");
  }
}

function buildPendingSuccessUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("payment", "pending_confirmation");
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}payment=pending_confirmation`;
  }
}

function toStripeMetadata(input: Record<string, string | undefined>): Record<string, string> {
  const metadata: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) {
      continue;
    }

    metadata[key] = value;
  }

  return metadata;
}
