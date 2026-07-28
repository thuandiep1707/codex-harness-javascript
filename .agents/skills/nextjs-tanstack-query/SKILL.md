---
name: nextjs-tanstack-query
description: Assess, design, implement, or revise an explicit TanStack Query v5 server-state flow in this Next.js 16 project, including client queries and mutations, query options and keys, invalidation, optimistic updates, the existing browser provider, server prefetching, dehydration, and hydration. Use only when the task explicitly requests TanStack Query or changes an existing TanStack Query flow; do not trigger for ordinary Server Component fetching, unrelated React state, or routine validation.
---

# Next.js TanStack Query

## Goal

Implement one approved server-state slice through the owning DDD context without turning it into a
project-wide query convention. Keep TanStack Query at presentation/delivery integration edges, reuse
the observed browser provider, and make cache and mutation effects explicit.

## Load authority and live evidence

1. Read `AGENTS.md`, the approved task plan, `.analysis/README.md`, and only the owning context
   analysis.
2. Read `src/modules/README.md`, `.agents/rules/frontend-coding.md`, and
   `.agents/rules/frontend/react-state-runtime.md`. Load async-state, testing, security, or other topic
   rules only when their triggers match the approved slice.
3. Inspect `package.json`, `eslint.config.mjs`, the current query provider, root layout composition,
   owning module layers, nearby query code, and direct consumers.
4. Read relevant installed Next.js 16 documentation and current official TanStack Query v5
   documentation before version-sensitive implementation.

The current provider and its defaults are observed evidence, not approved permanent policy. Installed
dependencies do not authorize a new query architecture, provider, global key factory, cache default,
or dependency change.

## Apply the architecture gate

`.analysis/README.md` defers TanStack Query conventions and server/client data flow. Before
implementation, record the task-local decisions that are required:

- owning bounded context, operation contract, and direct consumers;
- presentation binding and framework-free application seam;
- query identity/key inputs and any shared query-options contract;
- freshness, retry, refetch, garbage-collection, and enabled behavior;
- mutation invalidation or direct cache-update effects;
- optimistic update, rollback, and concurrent-mutation behavior;
- browser-only query versus server prefetch/dehydrate/hydrate behavior;
- loading, pending, error, empty, permission, cancellation, and offline behavior; and
- authorization, tenant/user/locale identity, serialization, and data-exposure constraints.

Stop dependent work at `tanstack-query-architecture-approval-required` when a required decision is
not approved. Continue independent approved work; never infer a global convention from one feature,
the installed packages, or provider defaults.

## Production Decision Matrix

Use this matrix to identify the execution mode, primary API, cache behavior, navigation impact, and exact code blueprint link for any server-state scenario in 10 seconds.

| Use Case | Render / Fetch | Primary API | Cache Strategy | Navigation / Hydration | Blueprint Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET List** | Client | `useQuery` | `queryOptions` + pagination | — | [query-patterns.md#recipe-1](references/query-patterns.md#recipe-1-query-key-factory--queryoptions-list--detail) |
| **GET Detail** | Client | `useQuery` | `enabled: Boolean(id)` | — | [query-patterns.md#recipe-1](references/query-patterns.md#recipe-1-query-key-factory--queryoptions-list--detail) |
| **Infinite List** | Client | `useInfiniteQuery` | `getNextPageParam` | Load more | [query-patterns.md#recipe-9](references/query-patterns.md#recipe-9-infinite-list-query-useinfinitequery) |
| **Debounced Search** | Client | `useQuery` | `placeholderData: keepPreviousData` | — | [query-patterns.md#recipe-10](references/query-patterns.md#recipe-10-debounced--search-query) |
| **SSR Hydration (single)** | Server | `prefetchQuery` | `prefetchQuery` + `dehydrate` | `HydrationBoundary` | [hydration.md#step-2](references/hydration.md#step-2-server-component-prefetch-route) |
| **SSR Hydration (parallel)** | Server | `Promise.all` | Multi `prefetchQuery` | `HydrationBoundary` | [hydration.md#recipe-b1](references/hydration.md#recipe-b1-parallel-multi-query-server-prefetch-promiseall) |
| **SSR + searchParams** | Server | `prefetchQuery` | Dynamic query key | `await searchParams` | [hydration.md#recipe-b2](references/hydration.md#recipe-b2-ssr-dynamic-searchparams-hydration) |
| **Auth Bootstrap** | Server | `prefetchQuery` | `userKeys.me` | Hydrate current user | [hydration.md#recipe-b3](references/hydration.md#recipe-b3-auth-bootstrap-server-hydration) |
| **POST → Invalidate List** | Client mutation | `useMutation` | `invalidateQueries({ queryKey: keys.lists() })` | Optional redirect | [query-patterns.md#recipe-3](references/query-patterns.md#recipe-3-mutation-with-query-invalidation) |
| **POST → Direct Insert** | Client mutation | `useMutation` | `setQueryData` (prepend) | Stay on page | [query-patterns.md#recipe-5](references/query-patterns.md#recipe-5-post-create---direct-cache-insert) |
| **PATCH → Invalidate Detail + List** | Client mutation | `useMutation` | Targeted dual invalidate | Stay on page | [query-patterns.md#recipe-7](references/query-patterns.md#recipe-7-patchput-update---dual-invalidation) |
| **PATCH → Optimistic** | Client mutation | `useMutation` | Snapshot + rollback (`onMutate`) | Stay on page | [query-patterns.md#recipe-4](references/query-patterns.md#recipe-4-optimistic-update-with-rollback) |
| **DELETE → Invalidate List** | Client mutation | `useMutation` | `invalidateQueries({ queryKey: keys.lists() })` | Stay on page | [query-patterns.md#recipe-3](references/query-patterns.md#recipe-3-mutation-with-query-invalidation) |
| **DELETE Detail → Remove Cache + Back** | Client mutation | `useMutation` | `removeQueries({ queryKey: keys.detail(id) })` | `router.back()` | [query-patterns.md#recipe-6](references/query-patterns.md#recipe-6-delete-detail---cache-eviction--navigate-back) |
| **Context-Wide Invalidation** | Client mutation | `useMutation` | `userKeys.all` | — | [query-patterns.md#recipe-8](references/query-patterns.md#recipe-8-context-wide--global-revalidation) |
| **Route Prefetch** | Client | `useQueryClient` | `prefetchQuery` | `router.prefetch` | [query-patterns.md#recipe-11](references/query-patterns.md#recipe-11-client-route-prefetch) |
| **Manual Refresh** | Client | `useQueryClient` | `refetchQueries` | — | [query-patterns.md#recipe-12](references/query-patterns.md#recipe-12-manual-refresh--refetch) |
| **Error Boundary Integration** | Client | `useQuery` | `throwOnError: true` | `error.tsx` | [query-patterns.md#recipe-13](references/query-patterns.md#recipe-13-error-boundary-integration-throwonerror) |


## Preserve project boundaries

Use this responsibility direction:

```text
module presentation (TanStack Query binding) ──► application contract ◄── infrastructure adapter
```

- Keep React and `@tanstack/react-query` out of domain and application.
- Do not make presentation import an infrastructure implementation directly.
- Do not invent dependency injection, a facade, repository construction, query-key folders, or a
  composition root when the owning context has not approved that seam.
- Keep routes thin and Client Component boundaries narrow.
- Do not copy server state into Context, a client store, or Effect-managed state.

## Workflow

### 1. Classify the server-state slice

Separate remote server state from local interaction, form, URL, and business invariant state. Map the
read/write operation, owner, consumers, identity inputs, authorization assumptions, and existing
seams. Return to boundary design when ownership is unresolved.

### 2. Design client query and mutation behavior

Read [query-patterns.md](references/query-patterns.md) for concrete TypeScript blueprints covering:
- DDD Presentation folder placement (`presentation/queries/`, `presentation/mutations/`).
- Query Key Factory & `queryOptions` (List & Detail).
- Client Query Hook bindings (`useQuery`).
- Mutations with explicit cache invalidation (`invalidateQueries`).
- Optimistic Updates with snapshot rollback (`onMutate`, `onError`, `onSettled`).

Obey the configured `@tanstack/eslint-plugin-query` flat recommended rules. Treat a lint failure as
contract evidence, not something to suppress.

### 3. Add server prefetch only when approved

Read [hydration.md](references/hydration.md) when server prefetch/dehydrate/hydrate is in scope. Follow its step-by-step blueprint:
- Step 1: Request-scoped `getQueryClient()` helper using React `cache()`.
- Step 2: Server Component prefetch & `HydrationBoundary` wrapper.
- Step 3: Client Component consumption with matching `queryOptions`.

Do not use a Next.js Server Action as a client-refetchable `queryFn`. A Server Action mutation is a
separate option that still requires approved command, error, authorization, and cache-effect
contracts.

### 4. Implement and validate the approved slice

- Keep `'use client'` at the narrowest component/hook boundary requiring Query hooks.
- Keep keys serializable and complete for the approved resource identity.
- Use `useQueryClient` only for approved cache operations.
- Validate consumers, pending/error/empty states, mutation failure, cache effects, remount/navigation,
  and concurrency where relevant.
- For hydration, also validate cross-request isolation, serialization, duplicate requests, immediate
  refetch, data ownership, and request waterfalls.
- Run lint, typecheck, build when framework boundaries change, and only tests approved by the
  Decision Gate.

Return to plan approval for a provider/default change, new global abstraction, dependency/config
change, experimental streaming package, or project-wide convention.

## Proactive Skill Evolution Protocol

Whenever an AI agent implements or modifies a server-state flow:

1. **Check Matrix Parity**: Compare the required query/mutation pattern against the Production Decision Matrix above.
2. **Identify Gaps**: If the scenario (e.g. WebSocket sync, Polling, Bidirectional Infinite Scroll, Multi-step form hydration) is NOT represented in the matrix or reference blueprints:
3. **Prompt Developer**: At task completion, the AI agent MUST explicitly ask the developer:

> 💡 **NEW SKILL USE-CASE DETECTED**: Use-case **[Name of Use Case]** is missing from `nextjs-tanstack-query` Decision Matrix. Would you like to create a task to update the skill with a new blueprint? (**yes** / **no**)

## Output contract

Report ownership, approved operation seam, task-local policies, query/mutation/options contracts,
keys and cache effects, browser/server client lifetimes, provider/hydration impact, consumers,
validation evidence, deferred decisions, and residual risks.

## Guardrails

- Never treat TanStack Query as domain or application logic.
- Never expose credentials, server-only implementations, or unauthorized data through a client
  query or dehydrated cache.
- Never create another global `QueryClientProvider` without explicit architecture approval.
- Never claim a mutation correct from a successful response alone; verify failure and cache behavior.
- Never convert a reference example or existing default into project-wide policy without approved
  analysis.
