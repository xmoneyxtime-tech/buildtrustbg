import {
  type AttachProviderPaymentMethodInput,
  type CancelProviderPaymentInput,
  type CreateProviderCustomerInput,
  type CreateProviderCustomerResult,
  type CreateProviderPaymentInput,
  type CreateProviderPaymentResult,
  type PaymentProvider,
} from "../provider";
import { type StripeConfig } from "../config";

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const;

  constructor(private readonly config: StripeConfig) {
    if (!this.config.secretKey || !this.config.publishableKey) {
      throw new Error("Invalid Stripe configuration.");
    }
  }

  async createCustomer(_input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult> {
    throw new Error("Not implemented: StripeProvider.createCustomer");
  }

  async createPayment(_input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult> {
    throw new Error("Not implemented: StripeProvider.createPayment");
  }

  async attachPaymentMethod(_input: AttachProviderPaymentMethodInput): Promise<void> {
    throw new Error("Not implemented: StripeProvider.attachPaymentMethod");
  }

  async cancelPayment(_input: CancelProviderPaymentInput): Promise<void> {
    throw new Error("Not implemented: StripeProvider.cancelPayment");
  }
}
