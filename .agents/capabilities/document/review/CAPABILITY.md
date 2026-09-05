# Document Review

Internal document capability. Do not expose this package as a user-facing `$` workflow.

## Purpose

Act as the final internal quality gate for Type 1 frontend documentation before User Approval.

Review the normalized working context together with the Product / Feature Requirement, Functional Specification, and UI/UX Specification to determine whether the document set is truthful, in scope, internally consistent, sufficiently complete, and ready for a developer to use without having to invent product, functional, or UI/UX behavior.

This capability reviews established truth and authored drafts. It does not brainstorm new product scope or choose unresolved behavior on the user's behalf.

## Input contract

Consume:

- `working_context` from `document/analysis`;
- `product_requirement`;
- `functional_spec`;
- `uiux_spec`.

Relevant working context includes current state, existing intent, requested change, change map, resolved clarifications, and unresolved uncertainties.

## Review responsibilities

### 1. Truth alignment

Compare the drafts against the normalized working context and identify:

- mismatches with current source-established behavior;
- requested changes omitted from the documents;
- old intent retained after being overridden by the developer prompt;
- uncertainties incorrectly written as facts;
- statements that have no evidence in source, existing docs, prompt, or resolved clarification.

Classify findings as matched, mismatched, missing, or unsupported where useful.

### 2. Cross-document traceability

Verify that important product requirements trace into the downstream layers that need to represent them:

`Product Requirement -> Functional behavior -> UI/UX representation`

Detect:

- product requirements without functional coverage;
- functional behaviors without a product basis;
- functional behavior requiring UI representation that is absent from the UI/UX specification;
- UI interactions that have no functional basis.

Do not require a UI representation for behavior that is not user-observable.

### 3. Scope integrity

Validate the document set against the approved changed, affected, preserved, and excluded scope.

Flag:

- scope leakage;
- redesign outside the requested change;
- speculative nice-to-have behavior;
- future use cases presented as current requirements;
- accidental changes to preserved behavior.

### 4. Assumption audit

Audit statements that may have been introduced during authoring. Distinguish confirmed or safely derived facts from unresolved or unsupported assumptions.

Unsupported assumptions must not remain as authoritative requirements. They must be removed, downgraded to an uncertainty, or sent to clarification when they materially affect development.

### 5. Completeness for development

Check completeness only within the current scope.

For Product Requirement, verify that development-relevant goal, actor, scope, requirement, business rule, and acceptance information is sufficiently clear.

For Functional Specification, verify that relevant behavior, affected existing behavior, meaningful states/transitions, cross-behavior relationships, and material validation/permission/side effects are sufficiently defined when applicable.

For UI/UX Specification, verify that the affected UI surface, interaction, observable state, relevant responsive behavior, and preserved UI are sufficiently defined when applicable.

The completeness test is not whether every possible detail is documented. The test is whether a developer would otherwise have to decide product, functional, or UI/UX behavior on their own.

### 6. Contradiction detection

Detect contradictions:

- inside a single document;
- between the three documents;
- between a document and the normalized working context.

Report the conflicting statements and the affected scope rather than silently selecting one.

### 7. Terminology and semantic drift

Detect cases where the same actor, state, rule, behavior, or concept is described with inconsistent terminology or meaning across documents.

Normalize only when the intended meaning is already established. Do not use terminology cleanup to invent a new interpretation.

### 8. Acceptance coverage

Verify that product acceptance criteria have corresponding functional and, when user-observable, UI/UX coverage.

Flag acceptance criteria that cannot be traced to a documented behavior or representation.

### 9. Preserved behavior and regression awareness

For brownfield changes, check that documented changes do not implicitly alter relevant preserved behavior unless the requested change explicitly requires it.

This is product/functional/UI regression awareness, not code-level regression analysis.

### 10. Open-question consolidation

Collect unresolved questions from analysis and all authored drafts, then:

1. deduplicate equivalent questions;
2. merge questions with the same underlying decision;
3. remove questions that are already resolved or no longer relevant;
4. identify the scope affected by each question;
5. classify questions as blocking or non-blocking for development readiness.

Deferred clarification remains in force: unresolved questions must not have blocked unaffected analysis or authoring before this checkpoint.

### 11. Development-readiness simulation

Review the document set from a developer's perspective and identify any remaining point where implementation would require the developer to invent a product, functional, or UI/UX decision.

Do not treat technical implementation choices, package selection, architecture conventions, styling implementation, or other capability-owned decisions as document-readiness gaps.

## Finding severity

Use two practical classes:

- `blocking`: must be resolved before the scope can be considered development-ready because otherwise the developer must guess relevant product, functional, or UI/UX behavior;
- `non_blocking`: improves document quality but does not prevent development from proceeding safely.

Do not inflate cosmetic or optional improvements into blocking findings.

## Review status

Return one of:

- `pass`: no material internal revision or clarification remains before User Approval;
- `needs-revision`: the drafts contain issues that can be corrected from already established context without asking the user;
- `needs-clarification`: at least one material decision cannot be resolved from established context and requires user input.

When both revision and clarification are needed, complete every safe internal revision first and preserve only genuinely unresolved decisions for clarification.

## Output contract

Return a review result equivalent to:

```yaml
review:
  status:

  truth_alignment:
    mismatched: []
    missing: []
    unsupported: []

  traceability:
    missing_links: []
    orphan_behaviors: []
    orphan_ui: []

  scope_integrity:
    leaks: []

  contradictions: []

  assumption_audit:
    unsupported_assumptions: []

  completeness_gaps: []

  terminology_inconsistencies: []

  regression_risks: []

  acceptance_gaps: []

  questions:
    blocking: []
    non_blocking: []

  readiness:
    dev_must_guess: []
```

The structure may omit empty sections in a rendered report, but the review capability must evaluate all relevant checks internally.

## Internal review sequence

Use this order:

1. validate drafts against normalized working truth;
2. check cross-document traceability;
3. check scope integrity;
4. audit assumptions;
5. check development-relevant completeness;
6. detect contradictions;
7. normalize terminology and detect semantic drift;
8. check acceptance coverage;
9. check preserved behavior and regression risk;
10. consolidate open questions;
11. simulate development readiness;
12. return review status and findings.

If a finding can be resolved from established working context, route it to internal revision rather than user clarification. Only unresolved decisions that cannot be safely determined from existing evidence belong in the clarification set.

## Boundary

This capability is the last internal documentation quality gate before User Approval.

It does not:

- invent new requirements;
- expand feature scope;
- decide unresolved product or UI behavior;
- make architecture or implementation choices;
- perform code review;
- perform test planning;
- mark documentation development-ready before required clarification and User Approval are complete.
