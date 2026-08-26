---
name: migrate-legacy-frontend-module
description: Execute a bounded behavior-preserving migration of legacy or demo frontend code into an already approved DDD module. Use only for the Coding specialist when the transient handoff contains approved target ownership, migration scope, characterization expectations, coexistence, cutover, rollback, and removal controls.
---

# Migrate Legacy Frontend Module

## Goal

Move only the assigned behavior into the approved target architecture without disguising a rewrite as
a migration. Preserve observable behavior intentionally, isolate compatibility code, and make cutover,
rollback, and legacy removal verifiable.

## Required authority

Read the transient handoff, approved dependency/design evidence when present, frontend Coding rules,
and only source in the allowed migration scope. Never read `.docs/` or `.analysis/`.

The handoff must name target context/layers, direct consumers, characterization expectations, allowed
migration slice, coexistence/cutover/rollback controls, and unresolved architecture decisions. Missing
or contradicted authority is a blocker to Orchestrator.

Do not use a migration Subtask to approve a new bounded context, data-flow/auth contract, template API,
dependency, or project-wide migration convention.

## Execution

### 1. Establish current behavior

Identify exact routes/source/consumers/data dependencies/state/assets/browser integrations involved in
the assigned slice. Read `references/characterization-and-cutover.md` only as needed. Capture critical
observable behavior and distinguish known preserved bugs from explicitly approved changes.

Testing is not self-routed from this skill; execute only validation assigned to the current Coding
Subtask. Separate Testing Subtasks remain owned by Orchestrator.

### 2. Expose seams

Map incoming consumers, outgoing calls, shared mutable state, framework/browser coupling, global styles,
side effects, subscriptions/workers, vendor types, and compatibility constraints. Separate business
behavior, infrastructure mapping, module presentation, already-approved shared UI, and temporary
bridges with explicit removal conditions.

Do not copy the legacy folder structure into the target context.

### 3. Use the approved migration strategy

Read `references/migration-strategy-options.md` when strategy detail is needed. If the handoff does not
fix a strategy and choosing one would affect architecture/coexistence/cutover policy, return a blocker
to Orchestrator instead of creating or revising a local plan.

### 4. Order work inside the assigned slice

Break the Coding Subtask internally into dependency-ordered implementation units only for execution,
not as a second workflow database. Each unit should identify behavior, required seam, affected source,
validation, coexistence/cutover gate, rollback relevance, and bridge-removal condition.

Do not persist these units into `.plans/`, `.progresses/`, `.agent/`, or other runtime files. If the
Subtask itself is too broad for safe execution, return a granularity blocker so Orchestrator can split
Jira work.

### 5. Implement bounded scope

Preserve DDD dependency direction and thin route composition. Reuse approved primitives/templates,
keep feature UI in module presentation, and avoid unrelated cleanup, style rewrites, dependency
upgrades, or architecture generalization.

On material scope/architecture change, stop dependent work and return the change to Orchestrator.
Do not record a local progress file.

### 6. Validate and cut over

Run assigned targeted and repository baseline validation. Verify parity evidence, approved differences,
rollback readiness, direct consumers, and bridge/legacy removal conditions. Remove legacy source only
when consumers and rollback obligations permit it.

## Output

Return target/strategy used, implemented migration units, baseline/parity evidence, changed files,
coexistence/cutover state, validation, rollback readiness, removed legacy surface, remaining debt, and
deviations in the implementation report.

Never claim parity from compilation alone and never leave a bridge/dual-running path without an owner
and removal condition.
