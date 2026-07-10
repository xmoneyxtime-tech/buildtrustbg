# BTOS Deployment

## Purpose
Define deployment standards for reliable and repeatable releases.

## Current Status
Operational baseline exists; process is being formalized.

## Deployment Standards
- Build must pass before release
- Environment variables must be configured per environment
- Prisma migrations must be applied safely and explicitly
- Deployment artifacts must be reproducible

## Environment Strategy
- Local: `.env.local` for developer runtime
- Shared defaults: `.env` where appropriate
- Hosted environments: platform secret manager only

## Release Safety Checklist
- Build pass confirmation
- Migration impact review
- Auth route protection verification
- Smoke test of critical flows

## Future Roadmap
- Add pre-deploy and post-deploy runbooks
- Add rollback strategy per release type
- Add automated health checks

## Related Documents
- [02_ENGINEERING_CONTRACT.md](./02_ENGINEERING_CONTRACT.md)
- [06_DATABASE_BLUEPRINT.md](./06_DATABASE_BLUEPRINT.md)
- [13_TESTING_STRATEGY.md](./13_TESTING_STRATEGY.md)
- [14_RELEASE_PROCESS.md](./14_RELEASE_PROCESS.md)
