# Payments Architecture

## 1. Overview

BuildTrustBG payment architecture is designed around a backend-authoritative domain model, provider abstraction, and verified asynchronous state transitions.

The backend owns all monetary data, order state, and activation logic. External providers are integrations, not sources of truth. Subscription state transitions are finalized only after verified webhook processing.

## 2. Payment Flow

Company

↓

Select Product

↓

Order

↓

Stripe Checkout

↓

Payment

↓

Webhook Verification

↓

Subscription Activated

## 3. Payment Domain

### Plan
Defines recurring plan structure, interval, price baseline, and activation state.

### Product
Represents purchasable catalog units tied to pricing and optional plan relation.

### Subscription
Tracks company subscription lifecycle and historical snapshot values used for long-term consistency.

### Order
Authoritative commercial intent created before payment. The order is the starting point for all payment attempts.

### OrderItem
Line-level composition of an order with quantity and captured price totals.

### Payment
Tracks transaction attempts and results, including provider-agnostic metadata references.

### Invoice
Represents billable accounting document state and totals associated with order/subscription context.

### Coupon
Defines reusable discount rule entities with lifecycle and redemption limits.

### Promotion
Represents campaign-level applicability over coupons/plans/products and validity windows.

### StoredPaymentMethod
Provider-linked saved method references for future payment UX and recurring operations.

### PaymentProviderEvent
Immutable ingestion log of provider events used for verification, idempotency, and traceability.

## 4. Provider Architecture

PaymentProvider Interface

↓

StripeProvider

↓

Future Providers

- myPOS
- BORICA

## 5. Security

- Webhook verification is mandatory before any irreversible state transition.
- Idempotency is required for provider event processing and payment state mutation.
- Audit trail is maintained via persistent payment and provider-event records.
- Frontend does not define or override pricing.

## 6. Supported Currency

EUR only.

## 7. Future Roadmap

- Apple Pay
- Google Pay
- Billing Portal
- Marketplace
- Wallet
- Affiliate Program

## 8. Non-negotiable Rules

- Subscription activation only through webhook.
- Never hardcode prices.
- Never trust frontend amounts.
- Always use internal IDs.
