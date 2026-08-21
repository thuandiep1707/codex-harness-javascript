# Loading, Error, and Empty-State Rules

Load this rule only when the frontend router matches loading, pending, error, empty, no-result,
no-selection, not-found, permission, or missing-configuration UI.

Use only patterns explicitly present in the transient handoff, approved design evidence, or compatible
current source. This rule does not authorize a new visual convention.

## Keep state meanings distinct

- **Loading:** required data/runtime is not ready.
- **Pending action:** a user-triggered operation is running.
- **Error:** an operation/runtime failed.
- **Initial empty:** request succeeded but no resource exists.
- **Filtered/search empty:** resources may exist but current criteria return none.
- **No selection:** data exists but no item is selected.
- **Not found:** requested route/resource does not exist under the approved contract.
- **Permission:** access is unavailable.
- **Missing configuration:** required setup is absent.

Do not collapse these behind a broad falsy-data check. Loading, error, permission, missing config, and
empty data are different contracts.

## Pattern reuse

Reuse an existing state component only when meaning, placement, interaction, and owner match the
current Subtask. Do not invent or install a spinner, skeleton, shimmer, overlay, retry panel, empty
illustration, notification convention, state icon/color/copy, or placeholder pattern without supplied
approval evidence.

Provider HTML/JSX/CSS/SVG/copy is design evidence only; never copy it directly as implementation
authority.

## Route boundaries

Preserve existing Next.js route ownership. Create/move/redesign `loading.tsx`, `error.tsx`,
`global-error.tsx`, or `not-found.tsx` only when the handoff explicitly includes that boundary and the
required design/behavior evidence exists.

Read installed Next.js documentation before changing a route boundary. Do not use `notFound()` for
ordinary request errors, permission outcomes, or missing application configuration.

## Pending actions

Unless already defined by approved evidence, treat these as unresolved product/interaction decisions:

- disabling/locking a control;
- changing labels or showing progress;
- preventing repeated submission;
- error placement;
- close/reset/retain behavior after success/failure;
- retry availability/limits.

Do not hide failures, turn errors into empty results, retry indefinitely, expose sensitive response
data, or treat `console.error` as a user-facing contract.

## Dynamic fallbacks

A dynamically imported component may use only an approved existing fallback matching the boundary.
Do not choose a spinner/skeleton or collapsing `null` merely to avoid an unresolved fallback decision.
Follow `react-state-runtime.md` for the dynamic-import decision itself.

## Completion

A missing state contract blocks only dependent scope. Return the exact state classification, owning
boundary, inspected compatible patterns, and missing decision to Orchestrator. Continue independent
assigned work where safe, but do not report affected behavior complete while required state behavior
remains unresolved.
