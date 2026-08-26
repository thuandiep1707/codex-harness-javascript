# React State and Runtime Rules

Load this rule only when the frontend router matches a Server/Client boundary, state ownership, Effect, custom hook, Context/Provider, store, browser API, integration runtime, or runtime code-split.

The transient Jira handoff, routed internal capabilities, and supplied approved evidence own architecture decisions. This rule does not read `.docs/`/`.analysis/`, approve a server-data architecture, select a state library, or create a local implementation plan.

## Framework evidence

Before changing framework-sensitive behavior, inspect the detected framework/runtime, live project configuration/dependencies, and installed documentation relevant to the Subtask. Do not assume Next.js semantics in a non-Next.js project or rely on remembered behavior from another framework version.

## Server/Client boundary

When the detected stack is Next.js App Router, keep Server Components by default and add `'use client'` at the narrowest cohesive boundary that directly needs client state/lifecycle/context, browser event handlers/APIs, or a browser-only dependency.

For other React frameworks/runtimes, follow their established boundary model instead of importing Next.js Server/Client rules.

Do not widen a client/runtime boundary merely because one nested region is interactive. Keep static/server-renderable content outside interactive islands when the active framework and component contracts support that model.

## State ownership

Place state at its lowest complete owner:

- preserve local state owned by approved primitives;
- molecule/organism or equivalent shared composition owns cohesive presentation interaction;
- lift shared sibling state only to the nearest common owner;
- module presentation owns module workflow state;
- keep business state out of shared presentation primitives/templates.

Do not duplicate one source of truth across local state, URL, Context, store, and server cache. Do not introduce Context/store just to avoid a small explicit props contract.

## Derivation and effects

Derive inexpensive values during render. Do not copy derived values into state or use an Effect to synchronize values that can be derived from current props/state.

Use memoization only for evidenced expensive pure computation or required stable identity according to the installed React/runtime guidance.

Use effects only for external synchronization such as browser APIs, subscriptions/listeners, timers, or approved runtime lifecycle. Put user-action logic in event handlers. Provide required cleanup. Do not use effect-based fetching as an invented project data-flow convention.

## New abstractions

Creating a new project-authored custom hook, Context/Provider, or store that establishes a reusable state contract requires explicit authority in the handoff or developer approval returned through Orchestrator.

When proposing one, identify owner, consumers, encapsulated state/effects/APIs, why colocation is insufficient, contract, lifecycle/reset risks, and alternatives. Missing approval blocks only the dependent scope.

Do not add an unapproved dependency. Installed libraries are evidence of availability, not automatic architecture approval.

## State/data capabilities

Use only state/data-flow internal capabilities explicitly routed in the handoff and compatible with current project evidence.

Examples:

- route `nextjs-tanstack-query` only for an approved TanStack Query flow in a project that actually uses/approves it;
- route state-management capability only when the assigned architecture requires URL/client/server-state reasoning;
- do not default to Zustand, TanStack Query, Redux, Context, or another library when evidence/authority is absent.

If server-state or client-state architecture is unresolved, return that decision to Orchestrator rather than selecting a familiar package.

## Browser/runtime isolation

Keep browser APIs and browser-only third-party runtimes inside narrow client/integration boundaries appropriate to the detected framework. Never import server secrets/repository implementations into a client graph. Do not move browser access upward when a smaller owner can contain it.

Third-party DOM mutation/inline-style behavior must also satisfy the styling/integration rules.

## Runtime code splitting

Moving JSX into another file is not runtime code splitting. Use the detected framework's normal static import model by default.

Consider dynamic loading only when supplied evidence establishes meaningful runtime/bundle cost, non-initial use, user-action-only use, or a verified browser-only dependency.

Do not dynamically import ordinary lightweight UI merely because components contain hooks. Every dynamic boundary requires approved evidence for exact target, why deferral matters, browser constraints, loading/fallback behavior, layout/interaction risk, and validation.

Use the installed framework documentation for dynamic-loading mechanics and `async-states.md` for fallback contracts.

## Completion

Return framework boundary decisions, state owner, relevant effect/abstraction decisions, routed state/data capabilities used, approvals, dynamic-boundary evidence, validation, and unresolved dependent scope in the implementation report. Do not invent missing architecture to report the Subtask complete.
