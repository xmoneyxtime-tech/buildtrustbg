# BTOS Architecture

## Purpose
Provide the architectural baseline for a scalable SaaS platform and trust ecosystem.

## Current Status
Core architecture is active and modular. Identity and application workflows are already implemented; company domain expansion is in progress.

## Architecture Principles
- Domain separation and clean boundaries
- Reusable services/components over duplication
- Predictable data access via Prisma
- Secure auth and role-based access via Auth.js v5
- Progressive extensibility without schema-breaking redesign

## Current Runtime Stack
- Next.js App Router
- Server-first rendering strategy
- Prisma ORM with PostgreSQL (Neon)
- Auth.js v5 with JWT session strategy

## Domain Map
- Identity
- Company
- Marketplace discovery
- Reputation
- Content (projects/gallery/services)
- Premium/billing
- Admin moderation
- Analytics/AI

## Recommended Layering
- `app/` presentation and routes
- `components/` reusable UI blocks
- `lib/` infrastructure and shared server utilities
- `app/api/` typed route handlers with validation
- `types/` shared contracts

## Future Roadmap
- Introduce explicit service layer for business workflows
- Add domain events/audit expansion
- Prepare multi-region and international rollout options

## Related Documents
- [01_PRODUCT_VISION.md](./01_PRODUCT_VISION.md)
- [06_DATABASE_BLUEPRINT.md](./06_DATABASE_BLUEPRINT.md)
- [10_DECISIONS.md](./10_DECISIONS.md)
- [11_SECURITY.md](./11_SECURITY.md)
- [12_DEPLOYMENT.md](./12_DEPLOYMENT.md)
