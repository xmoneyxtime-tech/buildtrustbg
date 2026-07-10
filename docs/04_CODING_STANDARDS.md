# BTOS Coding Standards

## Purpose
Standardize code quality, maintainability, and consistency across the platform.

## Current Status
Active standards; enforce on all new and changed code.

## Standards
- Strict TypeScript and explicit interfaces where needed
- Small focused modules and components
- No duplicated business logic
- Use existing architecture and naming conventions
- Use reusable UI building blocks
- Keep APIs typed and validated
- Keep server/client boundaries intentional

## Required Practices
- Handle loading, empty, success, and error states
- Return meaningful HTTP status codes
- Avoid magic values; centralize constants
- Protect secrets and environment values
- Add concise comments only for non-obvious logic

## Future Roadmap
- Add lint rules for architectural boundaries
- Add API contract validation templates
- Add component design review checklist

## Related Documents
- [02_ENGINEERING_CONTRACT.md](./02_ENGINEERING_CONTRACT.md)
- [03_ARCHITECTURE.md](./03_ARCHITECTURE.md)
- [07_UI_DESIGN_SYSTEM.md](./07_UI_DESIGN_SYSTEM.md)
- [13_TESTING_STRATEGY.md](./13_TESTING_STRATEGY.md)
