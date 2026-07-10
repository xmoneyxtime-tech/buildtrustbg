# BTOS Engineering Contract

## Purpose
Define the official development standard for BuildTrustBG engineering.

## Current Status
Official and enforced for all implementation work.

## Contract Principles
- Preserve working architecture and avoid unrelated rewrites
- Build production-ready features only
- Use strict TypeScript and reusable modules
- Prefer Server Components unless client behavior is required
- Keep authentication and security stable unless task requires change
- Prevent technical debt and avoid temporary hacks
- Never fabricate business data

## Required Workflow
1. Analyze
2. Design
3. Implement
4. Build
5. Fix build errors
6. Build again
7. Report result

## Build Safety
- `npm run build` is mandatory before completion
- Fix all build failures before handoff

## Quality Gates
- Architecture consistency
- Input validation and error handling
- Responsive and accessible UI
- Typed API contracts
- No secrets in logs or repository

## Future Roadmap
- Add standardized lint/type/test gates in CI
- Add architecture review checklist per PR
- Add domain-level ownership and CODEOWNERS

## Related Documents
- [00_PROJECT_MANIFESTO.md](./00_PROJECT_MANIFESTO.md)
- [03_ARCHITECTURE.md](./03_ARCHITECTURE.md)
- [04_CODING_STANDARDS.md](./04_CODING_STANDARDS.md)
- [11_SECURITY.md](./11_SECURITY.md)
- [13_TESTING_STRATEGY.md](./13_TESTING_STRATEGY.md)
- [14_RELEASE_PROCESS.md](./14_RELEASE_PROCESS.md)
