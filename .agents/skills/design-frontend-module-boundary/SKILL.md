---
name: design-frontend-module-boundary
description: Assess imported, legacy, demo, cloned, or new frontend capabilities before module creation; determine whether responsibility belongs to an existing or proposed bounded context, shared UI, delivery, or an integration adapter. Use when ownership, DDD placement, or the need for a new module is unclear.
---

# Design Frontend Module Boundary

## Goal

Establish an evidence-backed ownership and placement decision before proposing implementation files.
Keep capability boundaries separate from framework, UI-library, and vendor-library boundaries.

## Load authority first

1. Read `AGENTS.md` and the approved task plan workflow.
2. Read `.analysis/README.md` and identify candidate bounded contexts from task language and source
   evidence.
3. Read only the candidate `.analysis/<context>.md` files needed to resolve ownership. Do not load
   every context.
4. Read `src/modules/README.md` and `.agents/rules/frontend-coding.md` before proposing module or
   frontend placement. Load only topic rules triggered by concrete UI/runtime evidence; do not scan
   the topic-rule catalog.
5. Read installed Next.js documentation only when the intake reaches a framework-specific decision.

If an authority conflicts with the request, report the conflict and stop for developer direction.

## Workflow

### 1. Fix the intake boundary

- Record the source root, target repository, requested capability, expected consumers, and current
  authorization for reads, cloning, installs, and writes.
- Distinguish the imported source boundary from the business boundary it may support.
- Keep this step read-only unless an approved plan already authorizes implementation.

### 2. Collect evidence

Read [intake-evidence.md](references/intake-evidence.md). Run the inventory helper when a source tree
exists:

```powershell
node scripts/inventory-frontend-source.mjs --root <source-root> --format markdown
```

Treat helper output as file/import evidence only. Inspect business language, runtime behavior,
contracts, state, consumers, and critical flows directly.

### 3. Classify responsibilities

Classify each responsibility as one of:

- business rule or invariant;
- application orchestration or port;
- infrastructure/vendor/browser integration;
- module-specific presentation;
- shared non-business UI;
- framework delivery/routing; or
- unresolved.

Do not classify by source folder names alone. Record evidence and uncertainty for every non-trivial
classification.

### 4. Evaluate ownership

Read [ownership-and-placement.md](references/ownership-and-placement.md). Compare:

1. Extension of one approved bounded context.
2. Proposal for a new bounded context.
3. Integration adapter inside an owning context.
4. Shared UI or framework utility.
5. Rejection or isolation of source that does not belong in the target architecture.

Never treat an SDK, renderer, map engine, cloned repository, or visual workspace as domain logic
without business semantics and invariants.

### 5. Produce an impact model

Return:

- scope and evidence sources;
- inventory summary and limitations;
- business vocabulary and responsibility map;
- candidate ownership options and rejected options;
- dependency and consumer map;
- source-to-target placement table;
- deferred decisions, unknowns, and architecture conflicts;
- proposed analysis-document changes when a new boundary is requested; and
- validation strategy for the next implementation plan.

For proposed files, include `Why`, `Affected`, `Risk`, and `Control`.

### 6. Apply the decision gate

Stop at `architecture-approval-required` or `more-evidence-required`. Continue to an implementation
plan only when ownership is already approved and the intake result is `ready-for-implementation-plan`.

## Compose only as required

- Continue with `migrate-legacy-frontend-module` after an approved boundary for legacy/demo behavior.
- Run `audit-frontend-supply-chain`, then `integrate-third-party-frontend`, for external source or a
  vendor runtime.
- Load a test skill only when its test layer is explicitly being designed or implemented.

Do not read unrelated skill bodies.

## Guardrails

- Do not create a module, folder, analysis file, or source file during intake without an approved
  implementation plan.
- Do not invent migration, auth, DTO/repository, query/data-flow, loading/error/empty-state, or design
  token policy marked deferred by the repository.
- Do not restore disabled routes or bypass controlled templates.
- Do not hide unresolved evidence behind a confident ownership recommendation.
