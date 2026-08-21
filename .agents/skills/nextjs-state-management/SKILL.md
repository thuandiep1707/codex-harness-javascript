---
name: nextjs-state-management
description: Implement one approved Next.js client/state ownership decision involving URL state, local React state, Context/store, hydration, or explicit TanStack Query coordination. Use only for the Coding specialist when the transient Jira handoff scopes the state behavior.
---

# State Management

Read the transient handoff and necessary source/configuration only. Never read `.docs/`, `.analysis/`,
or chat history for missing ownership decisions. Installed libraries are capabilities, not automatic
project policy.

## Classify the assigned state

Use the ownership already approved by the handoff. If ownership is not fixed and selecting it would
establish architecture, return a blocker to Orchestrator.

Useful classification:

- **shareable/navigation state:** URL when the approved product contract requires persistence/shareability;
- **local UI state:** colocated React state at the lowest complete owner;
- **cross-component client state:** approved Context/store only when consumers genuinely cross a local
  ownership boundary;
- **server state:** approved server/data-fetching architecture, including TanStack Query only when
  explicitly scoped.

Never mirror server state into local/client stores merely for convenience and do not introduce a
global store/Context to avoid a small explicit props contract.

## URL state

Load `references/url-state.md` only when URL-driven state is approved. Preserve current repository
routing/search-param conventions and installed Next.js behavior. Do not adopt an unapproved helper
library merely because a reference mentions it.

## Client store

Load `references/zustand.md` only when the handoff explicitly approves Zustand/store ownership and the
package is actually installed/approved. Do not install it or create a project-wide store convention
through this skill.

## Server state

Route explicit TanStack Query work to `nextjs-tanstack-query`. Do not use `useEffect` fetching or a
client store as an alternate convention when server-state architecture is unresolved.

## Hydration

For browser-persisted state, avoid reading browser-only storage during server rendering. For server
prefetch/hydration, use only the architecture and APIs approved by the relevant server-state handoff
and installed framework/library versions.

## Output

Return selected approved owner, consumers, state source, changed files, hydration/runtime impact,
validation, and unresolved architecture/dependency decisions. Do not create local plan/progress files
or expand the Jira Subtask.
