---
name: docs-development-ready
description: Create or complete a coordinated development-ready documentation package for an existing feature by resolving project context from a free-form request, analyzing current truth, authoring Product / Feature Requirement, Functional Specification, and UI / UX Specification in sequence, reviewing them as one package, and finalizing only approved changes.
---

# Development-Ready Documentation Workflow

This is a user-facing workflow for producing the coordinated Type 1 document set required before frontend development begins.

## Goal

Produce three aligned documents in dependency order:

1. Product / Feature Requirement;
2. Functional Specification;
3. UI / UX Specification.

The workflow is brownfield-first: establish current project truth before documenting the requested delta. Treat the three documents as one coordinated package, not independent workflows.

## Execution

The Primary Controller owns runtime transport and user interaction. Documentation reasoning and authoring belong to one dedicated `document` child agent configured to use GPT-5.6 Sol.

1. Primary Controller resolves the working project and spawns one Document Agent child with the free-form user objective and available project context.
2. Keep the same Document Agent child alive across analysis, authoring, review, clarification, revision, approval, and finalization when the runtime permits it.
3. The Document Agent loads and executes only its allowlisted document capabilities. The Primary Controller must not perform document capability reasoning itself.
4. If the child returns `needs-clarification`, Primary Controller asks the consolidated questions, then sends the user's answers back to the same child.
5. If the child returns `ready-for-approval`, Primary Controller presents the reviewed package to the user without mutating target documents.
6. After explicit user approval, Primary Controller relays that approval to the same child so it can finalize only the approved documentation changes.
7. When the child returns `finalized` or `blocked`, Primary Controller captures the result and applies the normal child-agent close/verification lifecycle.

## Internal capabilities

The Document Agent owns these internal capabilities and uses them in this order when required by the resolved scope:

1. `document/analysis` -> normalized `working_context`;
2. `document/product-requirement-authoring` -> `product_requirement`;
3. `document/functional-spec-authoring` -> `functional_spec`;
4. `document/uiux-spec-authoring` -> `uiux_spec`;
5. `document/review` -> package-level quality gate.

Later stages consume the relevant upstream outputs. Do not author later documents directly from isolated source evidence before analysis and upstream authoring are complete.

## Workflow

### 1. Context resolution

Accept free-form user requests. Do not require a fixed prompt schema or mandatory fields.

Optional hints such as repository, module, feature/page, document path, or task description are accelerators only. Resolve missing context from the current project and the smallest relevant evidence set before asking the user.

Identify the target scope, relevant source, relevant existing docs, and requested change. Do not scan the full repository by default. Ask only when materially different interpretations remain and the ambiguity prevents reliable work.

When resolving document targets, use explicit user targets first, then existing relevant docs, then the project's established documentation convention. Never impose a harness-specific docs structure.

If target docs already exist, preserve and update them instead of creating duplicates. If a document or section is missing or incomplete, create or complete only what is needed. Do not rewrite unaffected content.

### 2. Analysis

Use `document/analysis` to reconcile:

- current implementation truth from source;
- existing intent/context from relevant old docs;
- newest requested change from the user prompt.

Build one normalized working context before authoring. Record uncertainty without interrupting unaffected work.

### 3. Sequential authoring

Author in dependency order:

1. Product / Feature Requirement;
2. Functional Specification using the working context and Product Requirement;
3. UI / UX Specification using the working context, Product Requirement, and Functional Specification.

Create, update, or complete only the documents and sections affected by the resolved scope. Preserve valid existing content whenever its meaning is unchanged.

### 4. Review and clarification

Run `document/review` across the full package as the final internal quality gate.

The review must check truth alignment, cross-document traceability, scope integrity, unsupported assumptions, contradictions, completeness, acceptance coverage, regression risk, and whether development would still require product/functional/UI guessing.

If the review finds issues that can be resolved from existing context, revise the affected drafts and review again without asking the user.

If user clarification is required, consolidate only the development-relevant unresolved questions and ask them at one checkpoint after all unaffected work is complete. Apply answers only to affected drafts, then review again.

### 5. Finalize

Present the reviewed package for user approval.

Until approval, keep changes as working drafts and do not mutate target project documentation.

After approval, finalize only the affected target documents or sections. Preserve unrelated content and follow the target project's existing documentation organization. Do not perform Git commit, push, or PR operations unless separately requested.

## Boundary

This workflow owns documentation context resolution, analysis, coordinated authoring, review, clarification, revision, approval, and finalization.

It does not own technical architecture, package/library selection, coding conventions, API contract design, database design, or implementation planning.

## Output

Return one coordinated development-ready package containing:

- Product / Feature Requirement;
- Functional Specification;
- UI / UX Specification;
- unresolved questions only when clarification is still required.

The package is ready for user approval only after the document review capability passes or all blocking clarification has been surfaced.
