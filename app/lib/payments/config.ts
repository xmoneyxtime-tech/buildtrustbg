import { SUPPORTED_PAYMENT_CURRENCY, type SupportedPaymentCurrency } from "./provider";

export type StripeConfig = {
  secretKey: string;
  publishableKey: string;
  webhookSecret?: string;
};

export type PaymentConfig = {
  stripe: StripeConfig;
  supportedCurrency: SupportedPaymentCurrency;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getStripeConfig(): StripeConfig {
  return {
    secretKey: readRequiredEnv("STRIPE_SECRET_KEY"),
    publishableKey: readRequiredEnv("STRIPE_PUBLISHABLE_KEY"),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.trim() || undefined,
  };
}

export function getPaymentConfig(): PaymentConfig {
  return {
    stripe: getStripeConfig(),
    supportedCurrency: SUPPORTED_PAYMENT_CURRENCY,
  };
}

export function assertSupportedCurrency(currency: string): asserts currency is SupportedPaymentCurrency {
  if (currency !== SUPPORTED_PAYMENT_CURRENCY) {
    throw new Error(`Unsupported payment currency: ${currency}. Only EUR is supported.`);
  }
}
