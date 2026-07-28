# Runtime and vendor isolation

Keep vendor/runtime mechanics at the edge and expose the smallest stable capability to application
and presentation consumers.

## Framework boundary

- Read relevant installed Next.js 16 documentation before deciding Client Components, dynamic
  loading, scripts, images, static assets, route boundaries, environment variables, or server APIs.
- Introduce `'use client'` at the narrowest interactive/runtime boundary.
- Guard browser globals during server rendering and avoid importing browser-only modules into server
  paths.
- Keep `src/app` limited to delivery composition.

## Contract isolation

- Define internal capability-oriented types; map vendor objects at the adapter boundary.
- Do not expose vendor classes, events, coordinates, errors, or configuration through domain ports.
- Keep business invariants in domain/application and rendering/SDK behavior in infrastructure or
  module presentation.
- Wrap subscriptions, listeners, resource creation, and teardown in one owned lifecycle.
- Document concurrency, cancellation, idempotency, ordering, and error translation.

## CSS and DOM

- Inventory global styles, resets, fonts, portals, shadow DOM, generated class names, and DOM
  assumptions.
- Prevent imported CSS from overriding shared primitives/templates.
- Use approved semantic z-index and isolated workspace stacking; do not introduce arbitrary high
  values.
- Verify focus, keyboard, accessible names, reduced motion, and screen-reader behavior.

## Workers, WASM, WebGL, and assets

- Record worker construction mode, URL resolution, CSP requirements, cross-origin isolation, and
  cleanup.
- Record WASM/model/tile/font/image provenance, serving path, cache policy, MIME type, and size.
- Verify WebGL/GPU feature detection, context loss, memory disposal, multiple instances, and fallback.
- Keep secrets and privileged tokens out of static/browser-delivered assets.
- Do not copy build outputs or binaries without provenance and license evidence.

## Security and network

- List third-party origins, telemetry, tile/model/data endpoints, cookies, storage, messaging, and
  token exposure.
- Validate `postMessage` origin/source, message schema, and replay/order assumptions.
- Route application/browser threats to `audit-frontend-security` and dependency/provenance evidence
  to `audit-frontend-supply-chain`.

## Validation

Verify direct consumers, typecheck/build, lifecycle cleanup, failure/teardown, offline or degraded
network behavior where required, CSP/runtime assets, critical user journeys, visual/template fit,
accessibility, performance budgets, and rollback/removal mechanics. Report unsupported environments
and untested vendor paths explicitly.
