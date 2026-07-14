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

export type ProviderCheckoutLineItem = {
  productId: string;
  name: string;
  description?: string;
  quantity: number;
  unitAmountMinor: number;
  currency: SupportedPaymentCurrency;
};

export type CreateCheckoutSessionInput = {
  companyId: string;
  orderId?: string;
  idempotencyKey?: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: ProviderCheckoutLineItem[];
  metadata?: Record<string, string>;
};

export type CreateCheckoutSessionResult = {
  providerCheckoutSessionId: string;
  checkoutUrl: string;
};

export interface PaymentProvider {
  readonly name: PaymentProviderName;

  createCustomer(input: CreateProviderCustomerInput): Promise<CreateProviderCustomerResult>;

  createPayment(input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult>;

  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult>;

  getCheckoutSession(providerCheckoutSessionId: string): Promise<CreateCheckoutSessionResult>;

  attachPaymentMethod(input: AttachProviderPaymentMethodInput): Promise<void>;

  cancelPayment(input: CancelProviderPaymentInput): Promise<void>;
}
