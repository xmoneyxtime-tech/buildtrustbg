# Engineering Principles

## 1. Mission

BuildTrustBG is developed as a production SaaS platform.

Every engineering decision must prioritize:

- Security
- Maintainability
- Scalability
- Traceability
- Reliability

## 2. Architecture Principles

- Backend is the single source of truth.
- Frontend never defines prices.
- All payments begin with Order.
- Subscription activation happens only after verified webhook.
- Internal IDs are authoritative.
- External provider IDs are references only.
- Provider abstraction is mandatory.

## 3. Security Principles

- Never trust client payment values.
- Verify every webhook.
- Idempotent webhook processing.
- No secrets in Git.
- Production secrets only through deployment environment.
- Test Mode before Production.

## 4. Code Quality

- No workaround when proper solution exists.
- Prefer typed Prisma over raw SQL.
- Every Prisma schema change requires:
  - prisma generate
  - prisma validate
- Every sprint requires:
  - lint
  - typecheck

## 5. Development Workflow

Architecture Review

↓

Implementation

↓

Lint

↓

Typecheck

↓

Review

↓

Commit

↓

PR

↓

Merge

↓

Deployment

## 6. Definition of Done

- [ ] Requirements implemented according to architecture principles
- [ ] Security review completed for trust boundaries and external inputs
- [ ] No hardcoded pricing or provider-specific business coupling in frontend
- [ ] Payment and subscription paths follow authoritative backend state
- [ ] Prisma changes (if any) generated and validated
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Code reviewed and traceable to requirements
- [ ] Documentation updated for new behavior and operational impact
- [ ] Release-ready with rollback and observability considerations

## 7. Engineering Philosophy

BuildTrustBG is built as a long-term production platform rather than a prototype.

Engineering decisions must optimize for durable system quality, predictable operations, and safe evolution over time.