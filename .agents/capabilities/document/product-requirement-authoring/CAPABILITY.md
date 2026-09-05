# Product Requirement Authoring

Internal document capability. Do not expose this package as a user-facing `$` workflow.

## Purpose

Transform the normalized working context produced by `document/analysis` into a structured Product / Feature Requirement draft that is ready to feed downstream documentation and development planning.

This capability answers one question: what must the feature achieve from a product perspective?

It does not rediscover source, rebuild source truth, reconcile source/doc/prompt conflicts, or make technical implementation decisions.

## Input contract

Consume the normalized context from `document/analysis`, including when available:

- `current_state`: relevant current behavior established from source;
- `existing_intent`: relevant product/design intent retained from existing docs;
- `requested_change`: the newest requested change from the developer prompt;
- `change_map`: scoped keep/change/add/remove deltas;
- `uncertainties`: unresolved product-level questions;
- `resolved_clarifications`: confirmed answers from clarification checkpoints.

The capability must not construct an alternate truth model that conflicts with the normalized working context.

## Responsibilities

### 1. Establish feature goal

Identify the product problem and desired outcome for the requested change. Keep implementation details out of the goal.

### 2. Identify actors

Record only actors directly affected by the requested scope. Do not add speculative roles.

### 3. Define scope boundaries

Separate included and excluded scope so the requirement cannot expand implicitly during authoring.

### 4. Translate the change map into product requirements

Convert relevant keep/change/add/remove items into clear product-level requirements. Preserve unchanged behavior only when it matters to the requested scope, prevents regression, or removes ambiguity.

### 5. Capture business rules

Record confirmed domain/product constraints separately from general requirements. Do not include framework, package, architecture, coding, or implementation conventions.

### 6. Derive product acceptance criteria

Express observable conditions that establish whether the product requirement has been satisfied. These are product acceptance criteria, not detailed test cases.

### 7. Preserve unresolved questions

Continue authoring all unaffected sections when an uncertainty exists. Carry unresolved questions forward with the scope they affect instead of guessing or blocking the whole draft.

## Output contract

Return a structured draft equivalent to:

```yaml
product_requirement:
  title:

  goal:
    problem:
    desired_outcome:

  actors: []

  scope:
    included: []
    excluded: []

  current_context:
    relevant_existing_behavior: []

  requirements:
    - id:
      description:

  business_rules:
    - id:
      description:

  acceptance_criteria:
    - id:
      description:

  open_questions:
    - id:
      question:
      affects:
```

`current_context` is intentionally compact and brownfield-oriented. Include only existing behavior directly relevant to the requested change; do not dump source analysis into the document.

## Internal process

Use this authoring sequence:

1. identify feature goal;
2. identify relevant actors;
3. establish scope boundaries;
4. translate the confirmed change map into requirements;
5. capture business rules;
6. derive product acceptance criteria;
7. attach unresolved questions to the affected scope;
8. return the Product / Feature Requirement draft.

If authoring reveals missing context, record the uncertainty and continue every section that does not depend on it.

## Boundary

This capability owns Product / Feature Requirement authoring only.

It does not own:

- source discovery or source analysis;
- existing-doc discovery;
- source/doc/prompt reconciliation;
- technical or architecture decisions;
- detailed functional flow/state specification;
- UI/UX interaction specification;
- implementation planning.

Downstream capabilities may use this draft as product-level input for functional and UI/UX specification work.
