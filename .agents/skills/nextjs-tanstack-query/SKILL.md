---
name: nextjs-tanstack-query
description: Implement or revise one approved TanStack Query v5 server-state slice in a Next.js project. Use only for the Coding specialist when the transient Jira handoff explicitly scopes TanStack Query; do not trigger for ordinary Server Component fetching or unrelated React state.
---

# Next.js TanStack Query

## Goal

Implement only the assigned server-state slice through its approved bounded context. Do not turn one
feature into a project-wide query convention.

## Authority and evidence

Read the transient handoff, approved dependency/design evidence, `frontend-coding.md`,
`react-state-runtime.md`, and only source/configuration required by the Subtask. Never read `.docs/`,
`.analysis/`, or chat history for missing requirements.

Inspect the installed TanStack/Next.js versions, current provider, nearby query code, owning module
layers, and direct consumers. Installed dependencies/provider defaults are observed evidence, not
permission to establish new global cache/query architecture.

The handoff must fix or explicitly authorize the task-local decisions needed by the slice, including
as applicable:

- owner, operation contract, consumers and resource identity;
- query key/options contract;
- freshness/retry/refetch/GC/enabled behavior;
- mutation invalidation/direct cache updates;
- optimistic update/rollback/concurrency behavior;
- browser-only versus server prefetch/hydration behavior;
- loading/error/empty/permission/cancellation/offline behavior;
- auth/tenant/user/locale identity and client-data exposure constraints.

Missing material decisions return `tanstack-query-architecture-approval-required` to Orchestrator.
Do not create a local plan or infer project policy.

## Preserve boundaries

```text
module presentation (TanStack binding) -> application contract <- infrastructure adapter
```

- keep React/TanStack Query out of domain/application;
- presentation must not import infrastructure implementation directly;
- keep route composition and Client boundaries narrow;
- do not copy server state into Context, Zustand, local state, or Effect-managed mirrors;
- do not create another global QueryClient provider or global key/cache convention without explicit
  architecture authority.

## Execution

### Client query/mutation

Load `references/query-patterns.md` only for the exact pattern needed: list/detail, infinite/debounced
query, mutation invalidation, direct cache update, optimistic rollback, delete eviction, prefetch,
manual refresh, or error-boundary integration.

Keep keys serializable and complete for approved resource identity. Use cache operations only when
the handoff defines their intended effect. Treat TanStack ESLint failures as contract evidence, not
warnings to suppress.

### Server prefetch/hydration

Load `references/hydration.md` only when server prefetch/dehydrate/hydrate is explicitly in scope.
Validate request isolation, serialization, duplicate requests, immediate refetch behavior, ownership,
and waterfalls. Do not use Server Actions as client-refetchable query functions by default.

### Async states

Load `async-states.md` when relevant states are in scope. Do not invent loading/error/empty behavior
from a reference recipe.

## Validation

Run targeted validation plus handoff/repository-required lint/typecheck/build/tests. Verify consumers,
cache effects, mutation failures, remount/navigation, concurrency when relevant, and hydration-specific
risks when used.

A provider/default change, dependency/config change, experimental package, new global abstraction, or
project-wide convention returns to Orchestrator before dependent code continues. Do not ask a separate
Decision Gate or create/update a local implementation plan.

If a useful pattern is missing from this skill/reference set, report it as optional follow-up evidence
to Orchestrator; do not interrupt the current Subtask with a mandatory prompt.

## Output

Return owner/operation seam, task-local query policies, keys/options/mutations/cache effects,
client/server lifetime decisions, provider/hydration impact, consumers, validation, unresolved
architecture decisions, and residual risks in the implementation report.

Never expose credentials/server-only implementations through client query/dehydrated state and never
claim mutation correctness from a successful HTTP response without verifying required cache/failure
behavior.
