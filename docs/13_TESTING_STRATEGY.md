# BTOS Testing Strategy

## Purpose
Define how quality is validated across product, API, data, and release flows.

## Current Status
Build verification is active; broader automated testing is planned.

## Test Layers
- Build and type safety checks
- API validation and error-path testing
- Critical auth and authorization flows
- Data integrity checks for Prisma workflows
- UI smoke checks for core conversion paths

## Required Baseline
- `npm run build` must pass
- New features must include failure-state handling
- Regression checks for auth-protected routes

## Future Roadmap
- Add unit/integration coverage for service logic
- Add route-level integration tests for API handlers
- Add E2E tests for registration, login, and company discovery

## Related Documents
- [02_ENGINEERING_CONTRACT.md](./02_ENGINEERING_CONTRACT.md)
- [04_CODING_STANDARDS.md](./04_CODING_STANDARDS.md)
- [11_SECURITY.md](./11_SECURITY.md)
- [14_RELEASE_PROCESS.md](./14_RELEASE_PROCESS.md)
