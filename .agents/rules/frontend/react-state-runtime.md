# React State and Runtime Rules

Load this rule only when the frontend router matches a Server/Client boundary, state ownership,
Effect, custom hook, Context/Provider, store, browser API, integration runtime, or runtime code-split.

The transient Jira handoff and supplied approved evidence own architecture decisions. This rule does
not read `.docs/`/`.analysis/`, approve a server-data architecture, or create a local implementation
plan.

## Framework evidence

Before changing framework-sensitive behavior, inspect the installed Next.js documentation and only
the live product configuration/dependencies relevant to the Subtask. Do not rely on remembered
behavior from another framework version and do not install a state/data library through this rule.

## Server/Client boundary

Keep Server Components by default. Add `'use client'` at the narrowest cohesive boundary that directly
needs client state/lifecycle/context, browser event handlers/APIs, or a browser-only dependency.

Do not mark a route, full screen, template, or large subtree client-side merely because one nested
region is interactive. Props crossing Server → Client must be serializable. Keep static/server-
renderable content outside interactive islands when component contracts allow it.

## State ownership

Place state at its lowest complete owner:

- preserve local state owned by approved primitives;
- molecule/organism owns cohesive presentation interaction;
- lift shared sibling state only to the nearest common owner;
- module presentation owns module workflow state;
- keep business state out of shared Atomic components/templates.

Do not duplicate one source of truth across local state, URL, Context, store, and server cache. Do not
introduce Context/store just to avoid a small explicit props contract.

## Derivation and effects

Derive inexpensive values during render. Do not copy derived values into state or use an Effect to
synchronize values that can be derived from current props/state.

Use `useMemo` only for evidenced expensive pure computation or required stable identity.

Use `useEffect` only for external synchronization such as browser APIs, subscriptions/listeners,
timers, or approved runtime lifecycle. Put user-action logic in event handlers. Provide required
cleanup. Do not use Effect-based fetching as an invented project data-flow convention.

## New abstractions

Creating a new project-authored custom hook, Context/Provider, or store that establishes a reusable
state contract requires explicit authority in the handoff or developer approval returned through
Orchestrator.

When proposing one, identify owner, consumers, encapsulated state/effects/APIs, why colocation is
insufficient, contract, lifecycle/reset risks, and alternatives. Missing approval blocks only the
dependent scope.

Do not add an unapproved dependency. Installed libraries are not automatic architecture approval.

## Server-state libraries

Use TanStack Query or another server-state abstraction only when the assigned Subtask or supplied
architecture evidence explicitly approves that flow. Do not invent query-key, cache, stale-time,
retry, invalidation, optimistic-update, prefetch/hydration, or parallel client-store conventions.

Route approved TanStack Query implementation details to the `nextjs-tanstack-query` skill.

## Browser/runtime isolation

Keep browser APIs and browser-only third-party runtimes inside narrow Client/integration boundaries.
Never import server secrets/repository implementations into the client graph. Do not move browser
access upward when a child boundary can own it.

Third-party DOM mutation/inline-style behavior must also satisfy the styling/integration rules.

## Runtime code splitting

Moving JSX into another file is not runtime code splitting. Use static imports by default.

Consider dynamic loading only when supplied evidence establishes meaningful client runtime/bundle
cost, non-initial use, user-action-only use, or a verified browser-only dependency.

Do not dynamically import ordinary shadcn atoms, lightweight UI, primary navigation, immediately
visible content, or components merely because they contain hooks.

Every dynamic boundary requires approved evidence for exact target, why deferral matters, browser
constraints, loading/fallback behavior, layout/interaction risk, and validation. Use `ssr: false` only
for verified browser-only dependencies inside Client Components, never to hide hydration or ownership
bugs.

Follow installed Next.js documentation for `next/dynamic`/`import()` mechanics and `async-states.md`
for fallback contracts.

## Completion

Return Server/Client decisions, state owner, relevant effect/abstraction decisions, approvals used,
dynamic-boundary evidence, validation, and unresolved dependent scope in the implementation report.
Do not invent missing architecture to report the Subtask complete.
