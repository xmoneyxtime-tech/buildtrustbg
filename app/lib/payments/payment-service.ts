import { prisma } from "@/lib/prisma";
import { assertSupportedCurrency } from "./config";
import {
  type AttachProviderPaymentMethodInput,
  type CancelProviderPaymentInput,
  type CreateCheckoutSessionResult,
  type CreateProviderCustomerInput,
  type CreateProviderCustomerResult,
  type CreateProviderPaymentInput,
  type CreateProviderPaymentResult,
  type PaymentProvider,
  type ProviderCheckoutLineItem,
  type SupportedPaymentCurrency,
} from "./provider";

export type CheckoutRequestItem = {
  productId: string;
  quantity: number;
};

export type CreateCheckoutSessionRequest = {
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

const CHECKOUT_IDEMPOTENCY_PREFIX = "checkout-session";
const CHECKOUT_REGISTRY_METHOD = "OTHER";

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  async createCustomer(input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult> {
    return this.provider.createCustomer(input);
  }

  async createPayment(input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult> {
    this.assertCurrency(input.currency);
    return this.provider.createPayment(input);
  }

  async createCheckoutSession(input: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResult> {
    if (!input.orderId.trim()) {
      throw new Error("Checkout requires a valid orderId.");
    }

    return prisma.$transaction(async (tx) => {
      // We lock the order row first so all concurrent checkout attempts for the same order serialize.
      // The first request creates the Stripe session and stores it in Payment.providerPaymentId.
      // Subsequent retries read and return that same session instead of creating a new one.
      await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${input.orderId} FOR UPDATE`;

      const order = await tx.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          id: true,
          companyId: true,
          status: true,
          currency: true,
          items: {
            select: {
              productId: true,
              quantity: true,
              unitPriceMinor: true,
              product: {
                select: {
                  name: true,
                  description: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new Error(`Order not found: ${input.orderId}.`);
      }

      if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
        throw new Error(`Order ${order.id} is not eligible for checkout.`);
      }

      this.assertCurrency(order.currency);
      const checkoutCurrency: SupportedPaymentCurrency = order.currency;

      if (order.items.length === 0) {
        throw new Error(`Order ${order.id} has no items.`);
      }

      const idempotencyKey = this.buildCheckoutIdempotencyKey(order.id);
      const existingCheckout = await tx.payment.findFirst({
        where: {
          orderId: order.id,
          provider: "STRIPE",
          method: CHECKOUT_REGISTRY_METHOD,
          providerCustomerId: idempotencyKey,
          providerPaymentId: {
            not: null,
          },
        },
        select: {
          providerPaymentId: true,
        },
      });

      if (existingCheckout?.providerPaymentId) {
        return this.provider.getCheckoutSession(existingCheckout.providerPaymentId);
      }

      const lineItems: ProviderCheckoutLineItem[] = order.items.map((item) => {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error(`Invalid quantity for product ${item.productId}.`);
        }

        if (!item.product) {
          throw new Error(`Product not found: ${item.productId}.`);
        }

        if (item.product.type !== "ONE_TIME") {
          throw new Error("Subscription checkout is not enabled in this sprint.");
        }

        return {
          productId: item.productId,
          name: item.product.name,
          description: item.product.description ?? undefined,
          quantity: item.quantity,
          unitAmountMinor: item.unitPriceMinor,
          currency: checkoutCurrency,
        };
      });

      const createdCheckout = await this.provider.createCheckoutSession({
        companyId: order.companyId,
        orderId: order.id,
        idempotencyKey,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        lineItems,
        metadata: input.metadata,
      });

      await tx.payment.create({
        data: {
          companyId: order.companyId,
          orderId: order.id,
          provider: "STRIPE",
          providerPaymentId: createdCheckout.providerCheckoutSessionId,
          providerCustomerId: idempotencyKey,
          status: "PENDING",
          method: CHECKOUT_REGISTRY_METHOD,
          currency: checkoutCurrency,
          amountMinor: 0,
        },
      });

      return createdCheckout;
    });
  }

  async attachPaymentMethod(input: AttachProviderPaymentMethodInput): Promise<void> {
    return this.provider.attachPaymentMethod(input);
  }

  async cancelPayment(input: CancelProviderPaymentInput): Promise<void> {
    return this.provider.cancelPayment(input);
  }

  private assertCurrency(currency: SupportedPaymentCurrency | string): asserts currency is SupportedPaymentCurrency {
    assertSupportedCurrency(currency);
  }

  private buildCheckoutIdempotencyKey(orderId: string): string {
    return `${CHECKOUT_IDEMPOTENCY_PREFIX}:${orderId}`;
  }
}
