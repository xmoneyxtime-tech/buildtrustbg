# BTOS Database Blueprint

## Purpose
Provide the database strategy and domain data model direction for long-term scale.

## Current Status
Active blueprint. Current production schema includes identity and company application baseline; broader company domain entities are planned.

## Core Principles
- Users and companies are separate concepts
- Authentication belongs to users only
- Business-critical events are traceable
- Preserve data integrity and avoid destructive flows
- Add capabilities via new entities and relations

## Current Implemented Baseline
- Identity entities: User, Account, Session, VerificationToken
- Company intake: CompanyApplication
- Role enum and moderation-oriented status enum

## Expansion Direction
- Company entity as canonical public profile owner
- Structured services/projects/gallery/reviews
- Verification, trust scoring, and audit trails
- Premium/subscription and billing entities

## Backward Compatibility Policy
- Use additive schema changes where possible
- Use migrations with clear intent and rollback planning
- Regenerate Prisma client after schema changes

## Future Roadmap
- v1.5: formal Company domain entities
- v2.0: communication and leads models
- v2.5: analytics and AI-derived data models

## Related Documents
- [03_ARCHITECTURE.md](./03_ARCHITECTURE.md)
- [10_DECISIONS.md](./10_DECISIONS.md)
- [11_SECURITY.md](./11_SECURITY.md)
- [13_TESTING_STRATEGY.md](./13_TESTING_STRATEGY.md)
