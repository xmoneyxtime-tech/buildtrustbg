import { assertSupportedCurrency } from "./config";
import {
  type AttachProviderPaymentMethodInput,
  type CancelProviderPaymentInput,
  type CreateProviderCustomerInput,
  type CreateProviderCustomerResult,
  type CreateProviderPaymentInput,
  type CreateProviderPaymentResult,
  type PaymentProvider,
  type SupportedPaymentCurrency,
} from "./provider";

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  async createCustomer(input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult> {
    return this.provider.createCustomer(input);
  }

  async createPayment(input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult> {
    this.assertCurrency(input.currency);
    return this.provider.createPayment(input);
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
}
