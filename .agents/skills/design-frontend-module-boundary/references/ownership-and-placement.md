# Ownership and placement

Choose ownership from responsibility and business language, not from the source folder name.

## Boundary decision

| Evidence                                                                                    | Prefer                                                            |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Behavior uses vocabulary and invariants already owned by one approved context               | Extend that bounded context                                       |
| Capability has distinct business language, lifecycle, policies, and consumers               | Propose a new bounded context and analysis document               |
| Code wraps an SDK, transport, browser API, worker, storage, map, video, or rendering engine | Integration adapter in infrastructure or presentation             |
| UI is business-specific even if visually reusable                                           | Owning module's `presentation` layer                              |
| UI has no business vocabulary and a stable cross-context contract                           | Existing shared `ui -> molecules -> organisms -> templates` layer |
| File only composes routing, metadata, or framework delivery                                 | `src/app` delivery layer                                          |

A vendor library, cloned renderer, or map engine is not a domain merely because it is large or is
introduced as a module. Place business decisions in domain/application and isolate vendor contracts
at an adapter boundary.

## DDD placement

- Put entities, value objects, invariants, and domain services in `domain` only when they are
  framework-independent business concepts.
- Put use cases, orchestration, DTOs, and ports in `application` only after their contracts are
  approved.
- Put HTTP clients, repositories, mappers, SDK wrappers, storage, workers, and browser integrations
  in `infrastructure`.
- Put screens, feature components, hooks, controllers, and view models in `presentation`.
- Keep route files thin and keep vendor types from crossing into domain contracts.

Follow `src/modules/README.md` and `.agents/rules/frontend-coding.md`; do not reproduce their full
rules in an intake report.

## Decision gates

Stop and request approval when the proposal would:

- create a bounded context, DDD sublayer, or cross-context business abstraction;
- decide a topic marked deferred in `.analysis/README.md` or a context analysis;
- alter a controlled template or shared design-system contract;
- place one responsibility in multiple contexts;
- introduce a dependency direction not already approved; or
- require source access, cloning, package installation, or external actions beyond current authority.

## Placement map format

For every proposed target file or responsibility, report:

| Source responsibility | Proposed owner/layer | Direct consumers | Dependencies | Evidence | Unknown/risk |
| --------------------- | -------------------- | ---------------- | ------------ | -------- | ------------ |

Conclude with exactly one status:

- `ready-for-implementation-plan`: ownership is already approved and evidence is sufficient.
- `architecture-approval-required`: a new or changed boundary is proposed.
- `more-evidence-required`: ownership cannot yet be decided safely.
