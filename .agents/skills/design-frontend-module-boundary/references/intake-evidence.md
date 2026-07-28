# Intake evidence

Collect facts before proposing ownership. Treat missing evidence as an explicit unknown; never fill a
gap with a preferred architecture.

## Scope

- Record the source root, target repository, requested capability, expected users, and requested
  routes or entry points.
- Separate source that may be inspected from source that may be modified.
- Record the approved target context when one exists. If it does not exist, keep context creation as
  a proposal requiring architecture approval.

## Automated inventory

Run the bundled helper from the skill directory:

```powershell
node scripts/inventory-frontend-source.mjs --root <source-root> --format markdown
```

Use JSON when another tool will consume the result. The helper reports file classes and import
evidence; it does not determine business meaning or file placement.

## Evidence categories

| Category          | Inspect                                                          | Record                                                                     |
| ----------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Runtime           | package manifests, lockfiles, build config, entry points         | framework, package manager, build/dev commands, browser/server assumptions |
| Delivery          | routes, pages, layouts, navigation, public entry points          | externally visible journeys and route ownership                            |
| Business language | labels, commands, state names, validations, workflows            | nouns, actions, invariants, and candidate context vocabulary               |
| State             | stores, reducers, query caches, URL state, browser storage       | owner, lifetime, source of truth, and synchronization                      |
| Integration       | HTTP, WebSocket, SSE, browser APIs, SDKs, workers                | external contracts, side effects, credentials, and failure modes           |
| UI                | components, global styles, design tokens, portals, canvases      | feature-specific versus reusable presentation responsibilities             |
| Assets            | images, fonts, models, WASM, workers, map/video data             | load path, license/source, size, and runtime constraints                   |
| Validation        | tests, fixtures, docs, screenshots, demos                        | current behavior evidence and uncovered critical flows                     |
| Operations        | environment variables, telemetry, errors, deployment assumptions | configuration ownership and production coupling                            |

Do not read secret values. Record only the presence and ownership of sensitive configuration.

## Dependency seams

For each important unit, capture:

1. Incoming consumers.
2. Outgoing imports or runtime calls.
3. Shared mutable state.
4. Browser or framework coupling.
5. Vendor types crossing public boundaries.
6. Behavior that can be characterized independently.

Distinguish a dependency observed in source from a dependency inferred from naming. Label every
inference.

## Minimum intake output

- Source and target scope.
- Inventory summary and limitations.
- Business vocabulary and capability list.
- Responsibility/dependency map.
- Candidate ownership options.
- Unknowns and deferred decisions.
- Evidence needed before implementation planning.
