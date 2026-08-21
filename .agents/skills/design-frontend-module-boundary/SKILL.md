---
name: design-frontend-module-boundary
description: Assess imported, legacy, demo, cloned, or new frontend capabilities before module creation; determine whether responsibility belongs to an existing or proposed bounded context, shared UI, delivery, or an integration adapter. Use only in Brain analysis/revalidation when ownership or DDD placement is unclear.
---

# Design Frontend Module Boundary

## Goal

Produce an evidence-backed ownership/placement decision for the analysis package before Orchestrator
creates Jira work. Keep business boundaries separate from framework, UI-library, and vendor-library
boundaries.

## Authority

Use only:

1. user objective and relevant product `.docs/` selected by Brain;
2. verified current product source/configuration evidence;
3. already-approved architecture decisions in the current analysis package/revalidation context;
4. installed framework documentation when a framework-specific decision is required.

Do not read or update `.analysis/`, local task plans/progress files, or Jira execution state from this
skill. Do not create implementation files.

If authoritative evidence conflicts, record the contradiction/open question in the analysis package
instead of resolving it through convention or source folder names.

## Workflow

### 1. Fix the intake boundary

Identify source root, requested capability, expected consumers, current business vocabulary, external
artifact boundary when relevant, and exact evidence available. Keep intake read-only.

### 2. Collect evidence

Read `references/intake-evidence.md` when needed. The bundled inventory helper may be used against an
existing source tree for file/import evidence only. Inspect business language, runtime behavior,
contracts, state, consumers, and critical flows directly before drawing ownership conclusions.

### 3. Classify responsibility

Classify material responsibilities as:

- domain/business rule or invariant;
- application orchestration/port;
- infrastructure/vendor/browser integration;
- module-specific presentation;
- shared non-business UI;
- framework delivery/routing;
- unresolved.

Do not classify by legacy/provider folder names alone.

### 4. Evaluate ownership options

Read `references/ownership-and-placement.md` when needed and compare:

1. extension of an existing bounded context;
2. proposed new bounded context;
3. integration adapter owned by a context;
4. shared UI/framework utility;
5. isolation/rejection of source that should not enter the target architecture.

An SDK, renderer, map engine, cloned repository, or visual workspace is not domain logic merely because
it is large or product-important.

### 5. Return analysis evidence

Return to Brain:

- evidence sources and limitations;
- business vocabulary/responsibility map;
- candidate ownership options and rejected alternatives;
- dependency/consumer map;
- proposed source-to-target placement direction;
- protected boundaries;
- unresolved architecture decisions/contradictions;
- validation implications for later Jira work.

Do not produce an implementation plan. Orchestrator converts approved analysis into Functional Tasks
and specialist Subtasks.

## Gates

Use `architecture-approval-required` or `more-evidence-required` when ownership cannot be established
from current authority. Do not create modules, folders, analysis files, source files, or local workflow
artifacts during this skill.
