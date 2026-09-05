# Frontend Development-Ready Document Flow

## Scope

This flow defines the Type 1 frontend documentation required before implementation can begin for an existing product codebase.

Type 1 frontend documents are:

1. Product / Feature Requirement
2. Functional Specification
3. UI / UX Design Specification

The flow does not duplicate knowledge that belongs to implementation skills or conventions. Architecture rules, package/library decisions, coding conventions, Next.js server/client conventions, API contracts, and data/database design are outside this document flow.

## Brownfield-first model

The default case is an existing project. Current source, relevant existing documentation, and the user's requested change are reconciled before final document content is produced.

```text
Existing project
      ↓
1. Context Resolution
      ↓
2. Analysis / Reconciliation
      ↓
3. Sequential Authoring
      ↓
4. Review & Clarification
      ↓
5. User Approval
      ↓
6. Finalize
```

## Flow

### 1. Context Resolution

Resolve the requested scope from the user's free-form request, relevant current source, and relevant existing documentation. Use explicit user-provided document targets first; otherwise follow the project's existing documentation convention.

### 2. Analysis / Reconciliation

Build one working truth from:

- current source behavior;
- existing documented intent/context;
- the newest requested change.

Identify what stays unchanged, what changes, what is added, and what is removed. Record unresolved uncertainty instead of guessing.

### 3. Sequential Authoring

Create, update, or complete the required Type 1 documents in dependency order:

1. Product / Feature Requirement;
2. Functional Specification;
3. UI / UX Design Specification.

Preserve valid existing content that is outside the affected scope. Do not rewrite an entire feature when only a bounded part changes.

### 4. Review & Clarification

Review the coordinated document package for truth alignment, cross-document consistency, scope integrity, unsupported assumptions, and development readiness.

Uncertainty must not unnecessarily block earlier work. Continue all unaffected authoring first, then consolidate only unresolved development-relevant questions at the clarification checkpoint. After answers are provided, revise only the affected parts and review again.

### 5. User Approval

Present the reviewed package only after review passes and no blocking clarification remains unresolved. The user reviews, corrects, and approves the documentation before it becomes final development input.

### 6. Finalize

Write only the approved documentation changes into the resolved target documents or project documentation location. Preserve unrelated content and do not impose a harness-specific folder such as `.docs/` when the user or project already establishes another authoritative target.

## Development-ready gate

The flow is complete when frontend development can begin without the developer having to guess product requirements, functional behavior, or UI/UX behavior.
