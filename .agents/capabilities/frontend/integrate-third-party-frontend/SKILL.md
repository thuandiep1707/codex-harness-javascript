---
name: integrate-third-party-frontend
description: Implement an approved external frontend project, SDK, widget, engine, mapping runtime, or cloned source behind a bounded vendor seam. Use only for the Coding specialist when the transient handoff fixes the exact artifact, module ownership, integration mode, supply-chain approval, runtime controls, rollback, and removal policy.
---

# Integrate Third Party Frontend

## Goal

Integrate only the assigned external capability behind a maintainable boundary. Preserve provenance,
license, runtime isolation, update ownership, rollback, and removal instead of copying an upstream
architecture into the business domain.

## Required authority

Read the transient handoff, frontend Coding rules, and only source/configuration in the allowed
integration scope. Never read `.docs/` or `.analysis/`.

The handoff must name business ownership, vendor placement, exact artifact identity, integration mode,
supply-chain approval, runtime controls, rollback/removal expectations, and allowed mutation surface.
Missing or contradicted authority is a blocker to Orchestrator.

Inspection/clone permission is not installation, vendoring, publishing, or mutation approval.

## Execution

### 1. Fix artifact identity and capability

Record exact source/version/commit/digest, required/excluded features, direct consumers,
runtime/deployment constraints, supported environments, upstream patches, generated bundles, workers,
WASM/models/tiles/fonts, and other copied artifacts.

Keep business behavior separate from SDK/rendering/browser/transport/asset mechanics.

### 2. Use an approved integration mode

Read `references/integration-mode-decision.md` when needed. Compare package, narrow wrapper, vendored
source, iframe/embed, separate frontend, or reimplementation only within decisions allowed by the
handoff.

If mode selection would change architecture, deployment, security, dependency, or ownership policy,
return a blocker/revision to Orchestrator instead of creating/revising a local plan.

### 3. Design the vendor seam

Expose capability-oriented internal contracts instead of leaking vendor APIs inward. Map vendor
objects/errors/events/config/lifecycle at the edge. Keep vendor/framework imports out of domain code.
Define initialization, subscriptions, cancellation, concurrency, cleanup, failure translation, and
multiple-instance behavior. Give every compatibility adapter/patch an owner and removal path.

### 4. Resolve runtime isolation

Read `references/runtime-and-vendor-isolation.md` as needed and inspect installed Next.js docs for
framework-sensitive behavior. Cover only the assigned scope across Client/Server boundaries, CSS,
portals/stacking, workers, WASM/WebGL, assets, CSP/cross-origin, browser messaging/network calls,
resource disposal, accessibility, and performance.

Return security/threat gaps to Orchestrator for Brain review; do not load Brain skills yourself.

### 5. Order implementation inside the current Subtask

Use dependency order internally, for example artifact reproducibility → adapter contract → runtime
isolation → module integration → route/template composition → validation/rollback. This is execution
sequencing, not a second task-management system.

Do not persist an implementation plan/progress file. If the assigned Coding Subtask contains multiple
independently acceptable integration outcomes or cannot be safely bounded, return a granularity
blocker so Orchestrator can split Jira work.

### 6. Implement and validate

Preserve DDD/shared UI/template boundaries. Keep upstream code and local patches identifiable. Avoid
unrelated formatting/rewrites. Run required build/typecheck/lint and assigned runtime/consumer checks.
Record upstream identity, local patches, owner, upgrade procedure, rollback, and exit/removal criteria.

Any new dependency, artifact, integration mode, runtime requirement, or architecture decision returns
to Orchestrator before dependent implementation continues.

## Output

Return exact source identity, supply-chain decision, integration mode, internal contract, runtime
boundary, changed files/artifacts, consumer impact, validation, known limitations, update/patch
ownership, rollback, and removal state.

Never vendor source without exact identity/license/patch ownership/update strategy, and never report
integration complete while cleanup, rollback, or removal remains undefined.
