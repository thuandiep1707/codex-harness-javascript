# Integration mode decision

Select an integration mode from evidence. No mode is the default for all open-source, 2D/3D,
mapping, visualization, or vendor projects.

## Preconditions

- `design-frontend-module-boundary` identifies the owning business context and adapter/presentation
  responsibility.
- `audit-frontend-supply-chain` identifies the exact artifact, license/provenance evidence, update
  owner, and unresolved adoption risk.
- Runtime, deployment, security, performance, browser, and release constraints are known.

## Modes

| Mode                                       | Prefer when                                                                          | Main risks                                                                         | Required controls                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Published package                          | Upstream provides a maintained consumable library and compatible contract            | Upgrade drift, transitive dependencies, bundle/runtime coupling                    | Pin through lockfile, adapter boundary, compatibility tests, update owner   |
| Wrapped package/SDK                        | Vendor API is broad or unstable but a small internal capability is needed            | Wrapper mirrors vendor API or leaks vendor types                                   | Narrow ports, internal mappers, contract tests, no domain imports           |
| Vendored source                            | Patching/build control is necessary and license permits redistribution               | Fork drift, unclear provenance, copied build artifacts, maintenance burden         | Exact upstream commit, patch ledger, license notices, update/exit procedure |
| Iframe/embed                               | Strong runtime/style isolation and a message contract are acceptable                 | Auth, navigation, accessibility, CSP, sizing, and message security                 | Origin allowlist, validated protocol, lifecycle/error handling, UX approval |
| Separately deployed frontend/microfrontend | Independent release/ownership is a real operational boundary                         | Duplicate runtime, contract/version drift, observability and deployment complexity | Explicit team ownership, versioned integration contract, failure isolation  |
| Reimplementation of required behavior      | Upstream runtime is incompatible but documented behavior/assets can be used lawfully | Behavior divergence, hidden IP/license assumptions, higher delivery cost           | Approved requirements, independent tests, provenance/license review         |

Do not choose source vendoring merely because a repository can be cloned. Do not choose a
microfrontend merely because a project is large.

## Decision factors

Compare:

1. Business ownership and public contract size.
2. Upstream maintenance, license, provenance, and security posture.
3. Server/client rendering, browser APIs, workers, WASM/WebGL, global CSS, and asset loading.
4. Bundle size, startup, memory/GPU, teardown, and concurrent-instance behavior.
5. CSP, iframe/origin, token/data exposure, and third-party network calls.
6. Accessibility, localization, design-system/template fit, portals, and stacking.
7. Testing, observability, update cadence, patch ownership, rollback, and removal.

## Decision record

Record the exact source artifact, selected mode, rejected alternatives, adapter contract, runtime
boundary, impacted consumers/config/assets, risk controls, update/rollback/exit owner, and validation
plan. Return to architecture approval if the selected mode changes a repository boundary.
