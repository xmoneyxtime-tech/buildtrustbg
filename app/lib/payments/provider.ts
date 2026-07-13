export const SUPPORTED_PAYMENT_CURRENCY = "EUR" as const;

export type SupportedPaymentCurrency = typeof SUPPORTED_PAYMENT_CURRENCY;

export type PaymentProviderName = "stripe";

export type CreateProviderCustomerInput = {
  companyId: string;
  email: string;
  name?: string;
};

export type CreateProviderPaymentInput = {
  companyId: string;
  amountMinor: number;
  currency: SupportedPaymentCurrency;
  providerCustomerId?: string;
  description?: string;
  metadata?: Record<string, string>;
};

export type AttachProviderPaymentMethodInput = {
  providerCustomerId: string;
  providerPaymentMethodId: string;
};

export type CancelProviderPaymentInput = {
  providerPaymentId: string;
};

export type CreateProviderCustomerResult = {
  providerCustomerId: string;
};

export type CreateProviderPaymentResult = {
  providerPaymentId: string;
  status: "pending" | "requires_action" | "succeeded" | "failed";
};

export interface PaymentProvider {
  readonly name: PaymentProviderName;

  createCustomer(input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult>;

  createPayment(input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult>;

  attachPaymentMethod(input: AttachProviderPaymentMethodInput): Promise<void>;

  cancelPayment(input: CancelProviderPaymentInput): Promise<void>;
}
