---
name: migrate-legacy-frontend-module
description: Plan and execute behavior-preserving movement of legacy or demo frontend code into an already approved DDD module. Use when source is freestyle or follows an old architecture and target ownership is approved; cover characterization, strategy choice, dependency-ordered slices, coexistence, cutover, rollback, and legacy removal.
---

# Migrate Legacy Frontend Module

## Goal

Move approved behavior into the target architecture without disguising a rewrite as a migration.
Preserve observable behavior intentionally, isolate temporary compatibility code, and make cutover,
rollback, and legacy removal verifiable.

## Require an approved target

1. Read `AGENTS.md`, the approved task plan, `.analysis/README.md`, the owning context analysis,
   `src/modules/README.md`, and `.agents/rules/frontend-coding.md`. Select only topic rules triggered
   by the approved migration slice and record them in the plan.
2. Require an approved intake result from `design-frontend-module-boundary` naming the target context,
   layers, direct consumers, and unresolved architecture decisions.
3. If ownership is missing or changed by new evidence, stop implementation and return to the boundary
   skill and plan approval.

Do not use a migration task to approve a new context, data-flow contract, auth policy, template API,
or project-wide migration convention.

## Workflow

### 1. Establish scope and baseline

- Identify the exact behavior, routes, source files, consumers, data/API dependencies, state, assets,
  browser integrations, and release boundary in the approved slice.
- Read [characterization-and-cutover.md](references/characterization-and-cutover.md).
- Capture current critical behavior before changing it. Label known bugs as preserved or explicitly
  approved changes.
- Load `testing` only after the repository Decision Gate approves the corresponding unit,
  integration, contract, component, or E2E layer.

### 2. Expose dependency seams

Map incoming consumers, outgoing calls, shared mutable state, framework/browser coupling, global
styles, side effects, subscriptions, workers, vendor types, and compatibility constraints. Separate:

- business behavior moving to domain/application;
- infrastructure and data mapping;
- module presentation;
- shared UI that already has approved reuse; and
- temporary bridges with a named removal gate.

Do not copy the old folder structure into the new context.

### 3. Select and approve a strategy

Read [migration-strategy-options.md](references/migration-strategy-options.md). Compare options using
task evidence and record rejected alternatives.

If strategy selection would establish or change project-wide migration policy, revise the plan and
wait for approval. Do not default to vertical slices, route-by-route migration, or a big-bang rewrite
solely from preference.

### 4. Plan dependency-ordered migration units

For each unit, define:

1. Concrete behavior and output.
2. Required earlier seam or contract.
3. Source and target files with `Why`, `Affected`, `Risk`, and `Control`.
4. Characterization and target validation.
5. Coexistence owner, cutover gate, rollback, and bridge-removal condition.

Keep temporary adapters directional. Prevent duplicate requests, mutations, subscriptions, listeners,
analytics, storage writes, or route ownership.

### 5. Implement only the approved unit

- Preserve DDD dependency direction and thin route composition.
- Introduce framework/client boundaries only after reading installed Next.js documentation.
- Reuse approved primitives/templates and keep feature UI in module presentation.
- Avoid unrelated cleanup, style rewrites, dependency upgrades, or architecture generalization.
- Update the progress file at every meaningful checkpoint and return to approval on material scope
  change.

### 6. Validate, cut over, and remove

- Run targeted tests and repository-required lint, typecheck, build, and browser validation.
- Complete the parity matrix and document every approved difference and uncovered risk.
- Verify release monitoring and rollback before switching consumers.
- Remove bridges and legacy source only after all consumers and rollback obligations are resolved.
- Record remaining debt with ownership; do not expand the migration to fix it automatically.

## Output contract

Report the approved target, strategy decision, migration-unit sequence, baseline/parity evidence,
changed files, coexistence and cutover state, validation results, rollback readiness, removed legacy
surface, remaining debt, and deviations.

## Compose only as required

- Use `audit-frontend-supply-chain` and `integrate-third-party-frontend` instead when the primary task
  is adopting external source/vendor runtime rather than migrating owned legacy behavior.
- Add security review only for a scoped threat surface.
- Do not enumerate unrelated skills.

## Guardrails

- Never declare parity from successful compilation alone.
- Never leave a bridge, flag, compatibility enclave, or dual-running path without an owner and removal
  gate.
- Never delete legacy code before direct consumers, rollback requirements, and evidence are resolved.
