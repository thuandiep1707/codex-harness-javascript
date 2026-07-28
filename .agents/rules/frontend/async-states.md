# Loading, Error, and Empty-State Rules

Load this rule only when the canonical router in `../frontend-coding.md` matches loading, pending,
error, empty, no-result, no-selection, not-found, permission, or missing-configuration UI. Use the
**route boundary**, **component/data state**, **pending action**, or **dynamic fallback** mode matching
the evidence.

The project-wide visual conventions for these states remain deferred in `.analysis/README.md`. This rule governs classification, reuse, and escalation; it does not approve a new visual pattern.

This rule owns state classification, exact-pattern reuse, and deferred visual escalation. It does not
own data-fetching architecture, runtime-splitting approval, or the visual design itself.

## Keep state meanings distinct

Identify the exact state before implementing or reporting it:

- **Loading:** required data or runtime is not ready yet.
- **Pending action:** a user-initiated operation is still running.
- **Error:** an operation or runtime failed.
- **Initial empty:** the request succeeded, but no resource exists yet.
- **Filtered or search empty:** resources may exist, but the current criteria return no result.
- **No selection:** data exists, but the user has not selected an item.
- **Not found:** the requested route or resource does not exist under the approved route contract.
- **Permission:** access is unavailable; do not misrepresent this as an empty dataset.
- **Missing configuration:** required setup is absent and may be an error or setup workflow rather than an empty state.

Do not collapse these conditions behind a broad falsy-data check. Loading is not empty, error is not empty, and permission or missing configuration must not silently become not-found behavior.

## Reuse only an approved matching pattern

Reuse an existing loading, error, or empty-state component only when its meaning, placement, interaction, and owning layer match the current requirement. Record the inspected pattern and why its contract applies.

The existence of a shadcn/ui component or a superficially similar screen is not design approval. Do not install or create any of the following without explicit developer approval:

- a spinner, skeleton, shimmer, or loading animation;
- a loading overlay or blocking loader;
- an error card, retry panel, or notification convention;
- an empty-state illustration or placeholder rows;
- state-specific icons, colors, messages, or action copy.

Design-provider HTML, JSX, CSS, SVG, or copy is design evidence only. Do not copy it into application source without a separately approved implementation decision.

## Preserve route-boundary ownership

Keep existing Next.js route boundaries and their ownership intact. Do not create, move, or redesign `loading.tsx`, `error.tsx`, `global-error.tsx`, or `not-found.tsx` unless the approved task plan and design explicitly require that boundary.

Read the relevant installed Next.js 16 documentation before changing a route boundary. Do not use `notFound()` to represent an ordinary request error, a permission result, or missing application configuration.

A route-level pattern is not automatically the correct component-level or action-level pattern.

## Do not invent pending-action behavior

Treat all of the following as product and interaction decisions unless an approved component contract or design already defines them:

- disabling or locking a control while an action runs;
- changing a label or showing progress;
- allowing or preventing repeated submission;
- choosing field, form, panel, or notification placement for an error;
- closing, resetting, or retaining a dialog after success or failure;
- offering retry and deciding its limits.

Do not fill a missing decision with a conventional-looking implementation. If safe action behavior depends on the decision, leave that action scope unresolved and continue independent work.

Visual deferral does not permit broken error logic. Do not swallow failures, convert failures into empty data, report success after failure, retry indefinitely, expose sensitive response data, or treat `console.error` as the user-facing error contract.

## Gate dynamic-loading fallbacks

A dynamically imported component may use only an existing approved fallback whose contract fits the exact boundary. Do not invent a spinner or skeleton, and do not use `null` merely to avoid choosing a pattern when it would collapse layout, hide a required control, or create unexplained blank space.

If runtime splitting is approved but no fallback is approved, record the fallback as unresolved under this rule. Follow `react-state-runtime.md` for the dynamic-import decision itself.

## Continue independent work

A missing state design is a local blocker, not permission to stop independent work. Use the shared
unresolved record in `../frontend-coding.md`, adding the exact state classification, owning boundary,
matching patterns inspected, and required message, icon, action, placement, or sizing decisions.

Do not claim the affected UI or task is fully complete when a required loading, pending, error, or empty-state behavior remains unresolved. Report completed independent scope and unresolved dependent scope separately.
