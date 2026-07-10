# BTOS Security

## Purpose
Establish security baseline for identity, data protection, and operational safety.

## Current Status
Active baseline. Auth.js role-based protection and secure secret handling are in place.

## Security Principles
- Least privilege and explicit authorization
- Secure secret management via environment variables
- No secret leakage in logs or source control
- Auditable critical actions
- Defensive input validation in APIs

## Current Controls
- Auth.js v5 session and JWT role enforcement
- Middleware route protection for role-scoped areas
- Prisma-backed data access with typed queries

## Required Practices
- Validate all external inputs
- Use secure password hashing for credentials
- Keep environment and runtime config consistent
- Avoid destructive database operations by default

## Future Roadmap
- Add centralized audit logging
- Add rate limiting and abuse detection
- Add automated security checks in CI/CD

## Related Documents
- [02_ENGINEERING_CONTRACT.md](./02_ENGINEERING_CONTRACT.md)
- [03_ARCHITECTURE.md](./03_ARCHITECTURE.md)
- [06_DATABASE_BLUEPRINT.md](./06_DATABASE_BLUEPRINT.md)
- [12_DEPLOYMENT.md](./12_DEPLOYMENT.md)
