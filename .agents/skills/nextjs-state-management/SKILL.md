---
name: nextjs-state-management
description: Decide and implement state ownership in Next.js applications using URL state, local React state, Zustand client state, and server-state boundaries. Use when frontend behavior introduces or revises filters, pagination, shareable navigation state, cross-component client state, per-request stores, hydration, or explicit TanStack Query usage.
---
# State Management

## **Priority: P2 (MEDIUM)**

## Decision Guide

1. **Shareable/persistent UI state?** Use URL state (`useSearchParams` + `useRouter` or `nuqs`).
2. **Server state (fetching, caching, revalidation)?** Use TanStack Query (`useQuery` / `useMutation`). Never sync server data into client stores (`useState` / Zustand).
3. **Global client UI state?** Use Zustand (in `'use client'` components only).
4. **Local component UI state?** Use React `useState` colocated in the consumer component.

## URL-Driven State

See [implementation examples](references/implementation.md) and [references/url-state.md](references/url-state.md).

## Server State (TanStack Query)

See [implementation examples](references/implementation.md) and refer to `nextjs-tanstack-query` skill for complete query/mutation policies.

## Client State (Zustand)

See [implementation examples](references/implementation.md) and [references/zustand.md](references/zustand.md).

## Hydration Safety

Wrap `localStorage` reads in `useEffect` or `mounted` flag to avoid hydration mismatches. For server prefetching in RSCs, use `prefetchQuery` + `dehydrate(queryClient)` and wrap client components with `<HydrationBoundary state={...}>`. Manage optimistic updates with `useOptimistic` in Next.js 15+.

## Library Patterns

- [references/zustand.md](references/zustand.md)
- [references/url-state.md](references/url-state.md)

## Anti-Patterns

- **No global store for simple state**: Use `useState` or URL params; avoid Zustand for basic local UI.
- **No large objects in state**: Decompose into granular primitives to prevent extra re-renders.
- **No `useEffect` for data fetching**: Use TanStack Query for server state.
- **No server state in client stores**: Fetch in RSCs or TanStack Query; keep client stores for UI-only state.
