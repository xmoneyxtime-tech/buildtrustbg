# Architecture Decisions

This document records important architectural decisions made during the development of BuildTrustBG.

Every major decision must include:

- Context
- Decision
- Alternatives
- Consequences

---

# ADR-001

## Title

Separate User and Company entities.

## Status

Accepted

## Context

Authentication and business data have different responsibilities.

## Decision

Users authenticate.

Companies represent businesses.

Companies never authenticate directly.

## Consequences

- Cleaner architecture
- Easier scaling
- Supports multiple companies
- Supports employee accounts
- Supports future mobile applications

---

# ADR-002

## Title

Trust cannot be purchased.

## Status

Accepted

## Decision

Premium subscriptions never affect the BuildTrust Score™.

Premium provides visibility and business tools only.

## Consequences

- Greater platform credibility
- Fair ranking
- Better customer confidence