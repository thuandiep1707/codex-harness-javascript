---
name: integrate-third-party-frontend
description: Implement an approved external frontend project, SDK, widget, engine, mapping runtime, or cloned source behind a bounded vendor seam. Use only for the coding specialist when the issue handoff fixes the exact artifact, module ownership, integration mode, supply-chain approval, runtime controls, rollback, and removal policy.
---

# Integrate Third Party Frontend

## Goal

Integrate only the required external capability behind a maintainable boundary. Preserve provenance,
license, runtime isolation, update ownership, rollback, and removal instead of copying an upstream
architecture into the business domain.

## Require approved intake and adoption evidence

1. Read the assigned `issue-handoff.yaml`, `.agents/rules/frontend-coding.md`, and only the source
   and configuration in the allowed integration scope.
2. Require the handoff to name business ownership, vendor placement, exact artifact identity,
   integration mode, and approved runtime controls.
3. Require the handoff to record supply-chain approval for the exact package, commit, fork, or
   artifact.
4. Never read `.docs/` or `.analysis/`. Stop and return a blocker to Orchestrator when boundary,
   provenance/license, update ownership, or integration mode is missing or contradicted.

Do not treat permission to inspect or clone source as permission to vendor, install, publish, or
modify the target repository.

## Workflow

### 1. Fix the external artifact and capability

- Record exact source, version/commit/digest, required features, excluded upstream features, direct
  consumers, runtime/deployment constraints, and supported environments.
- Identify business behavior that belongs in domain/application separately from rendering, SDK,
  browser, transport, and asset mechanics.
- Record upstream patches, generated bundles, workers, WASM, models, tiles, fonts, and other copied
  artifacts.

### 2. Select an integration mode

Read [integration-mode-decision.md](references/integration-mode-decision.md). Compare published
package, narrow wrapper, vendored source, iframe/embed, separately deployed frontend, and approved
reimplementation using task evidence.

Record rejected options. If the mode changes an architecture, deployment, security, or ownership
boundary, revise the plan and wait for approval.

### 3. Design the vendor boundary

- Expose capability-oriented internal contracts instead of mirroring the vendor API.
- Map vendor objects, errors, events, coordinates, configuration, and lifecycle at the edge.
- Keep vendor and framework imports out of domain code.
- Define initialization, subscriptions, cancellation, concurrency, cleanup, failure translation, and
  multiple-instance behavior.
- Assign an owner and removal path to every compatibility adapter or patch.

### 4. Resolve runtime isolation

Read [runtime-and-vendor-isolation.md](references/runtime-and-vendor-isolation.md). Inspect relevant
installed Next.js documentation before deciding framework-sensitive behavior.

Plan client/server boundaries, CSS, portals/stacking, workers, WASM/WebGL, static assets, CSP,
cross-origin requirements, browser messaging, third-party network calls, memory/GPU disposal,
accessibility, and performance budgets.

Return application/browser threat gaps to Orchestrator for Brain review; do not load Brain's
security skill or duplicate its review.

### 5. Build a dependency-ordered implementation plan

Order work so each phase establishes a seam used by the next:

1. Artifact/provenance and build reproducibility.
2. Narrow adapter contract and mappers.
3. Runtime/assets/lifecycle isolation.
4. Owning module presentation/application integration.
5. Thin route/template composition.
6. Verification, rollout, rollback, update, and removal.

For every file, record `Why`, `Affected`, `Risk`, and `Control`. Include configuration, workers,
assets, generated output, CSP/deployment, tests, and documentation consumers.

### 6. Implement and validate only approved scope

- Preserve DDD and shared UI/template boundaries.
- Keep upstream code/patches identifiable and avoid unrelated formatting or rewrites.
- Verify build/typecheck/lint, direct consumers, initialization/teardown, degraded network and failure
  paths, CSP/assets, critical browser journeys, accessibility, and performance.
- Record upstream version, local patches, owner, upgrade procedure, rollback, and exit criteria.
- Return a blocker to Orchestrator on any new dependency, artifact, integration mode, runtime
  requirement, or architecture decision.

## Output contract

Report exact source identity, supply-chain decision, selected/rejected integration modes, internal
contract, runtime boundary, changed files/artifacts, consumer impact, validation evidence, known
limitations, update/patch ownership, rollback, and removal state.

## Compose only as required

- Use `migrate-legacy-frontend-module` for owned legacy behavior whose target boundary is already
  approved; do not use it as a substitute for third-party adoption evidence.
- Load unit/component or Playwright testing only when that validation layer is in scope.
- Do not enumerate unrelated skills.

## Guardrails

- Never place a vendor engine in `domain` because of its size or product importance.
- Never vendor source without exact upstream identity, license evidence, patch ownership, and update
  strategy.
- Never expose unrestricted styling, z-index, or vendor configuration to bypass controlled templates.
- Never claim integration complete while lifecycle cleanup, rollback, or removal remains undefined.
