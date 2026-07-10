# BTOS Architecture Decision Log (ADR)

## Purpose
Record major architectural and product-critical technical decisions with context and consequences.

## Current Status
Active. New significant decisions must be appended using ADR format.

## ADR Template
- ID
- Status
- Context
- Decision
- Alternatives
- Consequences

## ADR-001 - Separate User and Company Concerns
- Status: Accepted
- Context: Identity and business profile data have different lifecycle and security requirements.
- Decision: Users authenticate; company data is represented in dedicated business entities.
- Alternatives: Single merged identity/business entity.
- Consequences: Cleaner boundaries, easier scaling, safer permission modeling.

## ADR-002 - Trust Score Integrity
- Status: Accepted
- Context: Paid products may conflict with trust credibility.
- Decision: Premium features must never directly change trust scoring.
- Alternatives: Premium-boosted trust score.
- Consequences: Higher platform credibility and fairer rankings.

## ADR-003 - Server-First Web Architecture
- Status: Accepted
- Context: Need strong SEO, performance, and maintainability.
- Decision: Prefer server rendering and server components by default.
- Alternatives: Client-heavy rendering.
- Consequences: Better indexing and predictable performance.

## ADR-004 - Additive Schema Evolution
- Status: Accepted
- Context: Platform requires long-term expansion with low migration risk.
- Decision: Favor additive Prisma migrations and backward compatibility.
- Alternatives: frequent breaking schema refactors.
- Consequences: safer releases and easier domain growth.

## Future Roadmap
- Add ADRs for billing, verification workflows, and AI governance boundaries.

## Related Documents
- [03_ARCHITECTURE.md](./03_ARCHITECTURE.md)
- [06_DATABASE_BLUEPRINT.md](./06_DATABASE_BLUEPRINT.md)
- [09_BUSINESS_MODEL.md](./09_BUSINESS_MODEL.md)
- [11_SECURITY.md](./11_SECURITY.md)
