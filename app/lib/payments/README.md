# Payment Provider Foundation

This module contains provider abstraction primitives for future payment integrations.

Current scope:
- Provider interface (`PaymentProvider`)
- Stripe provider scaffold (`StripeProvider`) with no API calls yet
- `PaymentService` that depends on the provider interface
- Environment-based configuration helpers
- EUR-only currency guard

Out of scope for this phase:
- Checkout flow
- Webhooks
- Billing portal
- Subscription lifecycle orchestration

Apple Pay and Google Pay will be handled later in the checkout capability layer,
where wallet-specific authorization and confirmation UX can be implemented.
The provider abstraction in this folder is intentionally wallet-agnostic.
