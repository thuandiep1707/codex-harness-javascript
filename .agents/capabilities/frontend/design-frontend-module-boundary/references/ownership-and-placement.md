# Ownership and placement

Choose ownership from responsibility and business language, not from the source folder name.

## Boundary decision

| Evidence | Prefer |
| --- | --- |
| Behavior uses vocabulary/invariants already owned by one approved context | Extend that bounded context |
| Capability has distinct business language, lifecycle, policies, and consumers | Return a proposed new bounded context as architecture-decision evidence |
| Code wraps an SDK, transport, browser API, worker, storage, map, video, or rendering engine | Integration adapter in infrastructure or presentation |
| UI is business-specific even if visually reusable | Owning module's `presentation` layer |
| UI has no business vocabulary and a stable cross-context contract | Existing shared component structure evidenced by the project |
| File only composes routing, metadata, or framework delivery | Framework delivery layer |

A vendor library, cloned renderer, or map engine is not a domain merely because it is large or introduced as a module. Place business decisions in domain/application and isolate vendor contracts at an adapter boundary.

## DDD placement

- Put entities, value objects, invariants, and domain services in `domain` only when they are framework-independent business concepts.
- Put use cases, orchestration, DTOs, and ports in `application` only when their responsibility/contracts are already approved.
- Put HTTP clients, repositories, mappers, SDK wrappers, storage, workers, and browser integrations in `infrastructure`.
- Put screens, feature components, hooks, controllers, and view models in `presentation`.
- Keep route/delivery files thin and keep vendor types from crossing into domain contracts.

Use current project source/config plus `.agents/rules/frontend-coding.md` as implementation evidence. Do not create a second architecture document or local planning system from this capability.

## Decision gates

Return architecture/replan evidence to the parent workflow when the proposal would:

- create or materially change a bounded context, DDD sublayer, or cross-context business abstraction;
- contradict an approved architecture constraint supplied by Brain/Jira context;
- alter a controlled template or shared design-system contract;
- place one responsibility in multiple contexts;
- introduce a dependency direction not already approved; or
- require source access, package installation, external mutation, or other authority beyond current mode.

Do not inspect historical `.analysis` reports as product authority and do not ask for an `implementation plan` gate. Brain owns architecture analysis/revalidation; Orchestrator owns Jira planning/replanning.

## Placement map format

For every proposed responsibility, return:

| Source responsibility | Proposed owner/layer | Direct consumers | Dependencies | Evidence | Unknown/risk |
| --- | --- | --- | --- | --- | --- |

Conclude with exactly one status:

- `ready`: ownership is supported by existing authority/evidence and can flow to Orchestrator planning/execution;
- `architecture-approval-required`: a new or materially changed boundary requires higher authority;
- `more-evidence-required`: ownership cannot yet be decided safely.
