# Characterization and cutover

Preserve observable behavior intentionally. Do not claim parity from compilation or visual similarity
alone.

## Baseline current behavior

Capture the smallest evidence set that protects critical behavior:

- user journeys, roles, routes, navigation, and permissions;
- inputs, validations, calculations, state transitions, and side effects;
- API requests/responses, mapping rules, error handling, cancellation, retries, and timing assumptions;
- browser storage, URL state, cross-tab/realtime behavior, workers, canvas/map/video interaction;
- loading, empty, error, notification, focus, keyboard, and accessibility behavior already present;
- supported viewport/runtime constraints and material performance thresholds; and
- known bugs intentionally preserved or explicitly approved for correction.

Use the `testing` skill for approved pure-behavior, component, integration, contract, or
characterization coverage and for approved Playwright browser journeys. Do not load it
skill unless that layer is in scope.

## Build a parity matrix

| Behavior | Legacy evidence | Target evidence | Allowed difference | Status/risk |
| -------- | --------------- | --------------- | ------------------ | ----------- |

Use one of: `matched`, `approved-change`, `blocked`, or `not-covered`. Never hide `not-covered` rows.

## Control coexistence

- Define which implementation owns each route, event, query, mutation, subscription, and side effect.
- Prevent duplicate requests, listeners, analytics, storage writes, or realtime subscriptions.
- Keep bridge contracts explicit and directional.
- Make temporary fallbacks observable and assign an owner/removal date or completion condition.
- Preserve disabled routes and approved template boundaries.

## Cutover gates

Before switching consumers:

1. Verify the approved slice and its direct consumers.
2. Run targeted tests, lint, typecheck, build, and relevant browser journeys.
3. Compare parity evidence and document accepted differences.
4. Verify monitoring/error evidence and rollback mechanics.
5. Confirm no target consumer still depends on an unapproved legacy path.

## Rollback and removal

- Define the rollback trigger, responsible owner, compatible data/state assumptions, and maximum
  rollback window.
- Keep rollback separate from permanent dual-running.
- Remove bridges, flags, copied assets, obsolete routes, and legacy dependencies only after all
  consumers and rollback requirements are resolved.
- Record remaining debt, risk, and follow-up ownership rather than broadening the migration task.
