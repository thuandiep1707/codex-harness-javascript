---
name: docs-development-ready
description: Create a coordinated development-ready documentation package for an existing feature by analyzing current truth, authoring Product / Feature Requirement, Functional Specification, and UI / UX Specification in sequence, reviewing them as one package, and resolving only development-relevant uncertainties before final approval.
---

# Development-Ready Documentation Workflow

This is a user-facing documentation workflow for producing the coordinated Type 1 document set required before frontend development begins.

## Goal

Produce three aligned documents in dependency order:

1. Product / Feature Requirement;
2. Functional Specification;
3. UI / UX Specification.

The workflow is brownfield-first: establish current project truth before documenting the requested delta. The three documents are authored as one coordinated package rather than as independent workflows.

## Capability composition

Use the internal document capabilities in this order:

1. `document/analysis` -> normalized `working_context`;
2. `document/product-requirement-authoring` -> `product_requirement`;
3. `document/functional-spec-authoring` -> `functional_spec`;
4. `document/uiux-spec-authoring` -> `uiux_spec`;
5. `document/review` -> package-level quality gate.

Each downstream capability consumes the relevant upstream outputs. Do not author a later document directly from an individual source before the earlier normalization and authoring stages are complete.

## Workflow

1. Analyze source code, relevant existing docs, and the developer prompt into one reconciled working context.
2. Author the Product / Feature Requirement.
3. Author the Functional Specification using the working context plus the Product Requirement.
4. Author the UI / UX Specification using the working context, Product Requirement, and Functional Specification.
5. Review the full package for truth alignment, traceability, scope integrity, unsupported assumptions, contradictions, completeness, acceptance coverage, regression risk, and development readiness.
6. If clarification is required, consolidate unresolved development-relevant questions and ask them at one clarification checkpoint after all unaffected work is complete.
7. Apply answers only to affected documents by rerunning the necessary authoring capabilities rather than regenerating the whole package by default.
8. Run review again after revision.
9. Present the reviewed package for user approval.
10. Finalize only after approval.

## Non-blocking clarification

Do not interrupt between document stages merely because one point is uncertain. Record uncertainty, continue every unaffected part of the workflow, and defer questions to the review/clarification checkpoint unless the ambiguity prevents all remaining useful work.

## Boundary

This workflow coordinates document analysis, authoring, review, clarification, revision, approval, and finalization. It does not own technical architecture, package/library selection, coding conventions, API contract design, database design, or implementation planning.

## Output

Return one coordinated development-ready documentation package containing:

- Product / Feature Requirement;
- Functional Specification;
- UI / UX Specification;
- unresolved questions only when user clarification is still required.

The package is considered internally ready for user approval only after the document review capability passes or all blocking clarification has been surfaced.
