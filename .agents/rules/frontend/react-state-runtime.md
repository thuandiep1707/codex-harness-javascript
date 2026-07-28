# React State and Runtime Rules

Load this rule only when the canonical router in `../frontend-coding.md` matches a Server/Client
boundary, state ownership, Effect, custom hook, Context/Provider, store, browser API, integration
runtime, or code-splitting decision. Use only the relevant internal mode: **component boundary**,
**local state/derivation/effect**, **state abstraction**, or **browser/runtime splitting**.

This rule does not approve a server-data architecture. TanStack Query conventions and the broader server/client data-flow decision remain deferred in `.analysis/README.md`.

This rule owns React execution boundaries, client state and effect placement, abstraction gates,
browser isolation, and runtime splitting. Atomic owns component contracts, Styling owns inline-style
exceptions, Async States owns fallback design, and the explicit TanStack Query skill owns an approved
task-local TanStack workflow without changing the project-wide deferral.

## Read installed framework evidence first

Before changing a framework-sensitive boundary, read the relevant installed Next.js 16 documentation under `node_modules/next/dist/docs/`. In particular, verify the current rules for Server and Client Components, the `'use client'` directive, and lazy loading instead of relying on behavior from another Next.js version.

Treat `package.json` as the authority for installed state and data libraries. Do not install, configure, or adopt a library through this rule.

## Use Server Components by default

Keep a component as a Server Component unless it directly needs client state/lifecycle/context,
browser event handlers or APIs, or a browser-only third-party library.

Add `'use client'` at the narrowest component boundary that owns the requirement. Do not mark a route, screen, template, organism, or other large subtree as a Client Component merely because one nested region is interactive.

Remember that a `'use client'` entry point brings its imported module graph into the client bundle. Props crossing from a Server Component to a Client Component must be serializable. Server-rendered content may be passed through approved `children` or named-slot contracts when that preserves a smaller client boundary.

An interactive island is the smallest Client Component subtree owning a cohesive interaction. Keep
static and server-renderable content outside it; justify any larger boundary in the approved plan.

## Isolate browser runtimes

Keep browser APIs and browser-only third-party runtimes inside a narrow Client Component or approved integration boundary. A presentation component may coordinate rendering and lifecycle, but it must not absorb an infrastructure contract or module business behavior merely to access the browser.

Do not import server-only secrets, repositories, or implementations into a client module graph. Do not move browser access upward into a route, template, or full screen when a child boundary can own it.

Any third-party requirement for DOM mutation or inline styles must also satisfy the exception and approval rules in `styling-layout.md`.

## Place state at its lowest complete owner

Place state in the lowest component that owns the behavior and contains every consumer that needs it:

- preserve local state owned by an approved shadcn/Radix primitive;
- let a molecule own a small, cohesive presentation interaction;
- let an organism coordinate presentation state across its lower-level parts;
- when sibling components need the same state, lift it only to their nearest common parent;
- let a module screen or controller coordinate workflow state that spans multiple organisms;
- keep business state out of shared templates and shared Atomic Design components.

Do not duplicate one source of truth across local state, URL state, Context, and a store. Do not introduce Context or a store merely to avoid a small, explicit props contract.

Follow `atomic-components.md` for controlled and uncontrolled component APIs. State ownership does not authorize an imperative ref API or a structural escape hatch.

## Derive values during render

Calculate derived values directly during render when the calculation is inexpensive. Do not copy derived values into `useState`, and do not use `useEffect` to synchronize a value that can be derived from current props or state.

Use `useMemo` only when at least one of these conditions is evidenced:

- a pure calculation is meaningfully expensive; or
- stable reference identity is required by a dependency or memoized consumer.

Do not add `useMemo` as a default wrapper around ordinary expressions. Memoization must preserve a pure calculation and declare complete dependencies.

## Use effects only for external synchronization

Use `useEffect` only to synchronize a Client Component with an external browser API, approved
runtime, subscription/listener, timer, or media/canvas/DOM lifecycle.

Put logic caused by a user action in the corresponding event handler rather than in an Effect that detects the action later. Add cleanup for subscriptions, listeners, timers, and runtime instances when their contract requires it.

Do not use an Effect for render preprocessing or derived state. Do not establish direct API fetching in an Effect as a substitute for the deferred server-data decision.

## Require approval for new state abstractions

Creating a project-authored custom hook requires explicit developer approval. Record its problem and
owner, consumers, encapsulated state/effects/APIs, why colocation is insufficient, proposed contract,
lifecycle/cleanup/dependency risks, and alternatives.

Creating a new Context/Provider also requires explicit developer approval. A module Context must remain owned by and private to that bounded context. A new global Context is allowed only for an explicitly approved application-wide concern such as authentication or authorization. Place a provider as deep as its consumer boundary permits.

Creating a new store requires explicit developer approval and the same ownership, consumer, lifecycle, and reset analysis. A module store must not be consumed by another bounded context. A global store is reserved for an explicitly approved application-wide authentication or authorization concern. Do not use a store for local component state, ordinary form state, or as a duplicate cache for server data.

Zustand is not currently installed. Do not assume it is available or add it in an unrelated task; any dependency adoption must appear in a separately approved plan.

Missing approval for one hook, provider, or store blocks only the dependent implementation. Continue independent approved work and consolidate the unresolved proposal at task end.

## Preserve the TanStack Query deferral

The repository contains TanStack Query dependencies, but their use does not constitute an approved data-flow convention. Until the developer approves that architecture, do not invent:

- query or mutation hooks;
- query-key factories or naming rules;
- cache, stale-time, retry, or invalidation policies;
- optimistic updates;
- prefetch, dehydration, or hydration conventions;
- a parallel Effect-based fetch convention;
- a Zustand or Context copy of server state.

When a task reaches one of these decisions, record the concrete query or mutation requirement, its proposed owner, the consumers, and the unresolved cache or invalidation questions. Continue independent work. If the server-state decision is essential to the requested behavior, report that dependent scope as unresolved rather than selecting a convention implicitly.

## Use static imports by default

Atomic decomposition and moving a component into its own file are source-organization decisions; they do not justify runtime code splitting.

Use static imports unless repository evidence shows that a component or dependency:

- has meaningful client-side runtime or bundle cost;
- is not required for the initial render;
- is used only after a user action; or
- cannot execute in a server environment.

Assess code splitting for browser-heavy capabilities such as maps, WebGL or other 2D/3D engines, video runtimes, charting libraries, rich-text or code editors, large previewers, and substantial client-only SDKs. Assessment is not automatic authorization to split them.

Do not dynamically import:

- standard shadcn/ui atoms;
- lightweight molecules or organisms;
- primary navigation;
- immediately visible content;
- a component merely because it uses a React hook or has its own file.

Do not add viewport-triggered loading or a custom lazy-loading hook without separate developer approval.

## Gate every dynamic boundary

Every `next/dynamic` or dynamic `import()` decision must already be in the approved plan with the
exact deferred component/dependency, initial-render need, browser constraints, expected runtime or
bundle benefit, approved loading/fallback behavior, layout-shift and interaction risk, and success or
failure validation.

Keep `next/dynamic` declarations at module scope with an explicit import path as required by the installed documentation. A user-action `import()` is allowed only when the approved plan demonstrates that the dependency is meaningfully deferred and the owning module, not shared UI, coordinates the operation.

Use `ssr: false` only for a verified browser-only dependency and only inside a Client Component. Do not use it to hide hydration mismatches, non-deterministic rendering, invalid HTML, incorrect state initialization, or a misplaced integration boundary.

Server Components are already code-split by Next.js. Do not assume that dynamically importing a Client Component from a Server Component creates an additional client split; verify the installed Next.js documentation and resulting build behavior.

Loading, error, and fallback visuals for a dynamic boundary must follow `async-states.md`. A missing approved fallback is an unresolved design decision, not permission to invent a spinner, skeleton, or collapsing `null` fallback.
