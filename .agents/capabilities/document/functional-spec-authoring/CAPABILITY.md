# Functional Specification Authoring

Internal document capability. Do not expose this package as a user-facing `$` workflow.

## Purpose

Transform the normalized `working_context` plus an approved Product / Feature Requirement into a Functional Specification draft that defines the behavioral contract of the requested change.

This capability answers: who can do what, under which conditions, how the system must respond, how relevant states change, how related behaviors interact, which rules must remain true, and which product-level uncertainties are still unresolved.

It does not define visual presentation or technical implementation.

## Input contract

Consume:

```yaml
working_context:
  current_state:
  existing_intent:
  requested_change:
  change_map:
  uncertainties:
  resolved_clarifications:

product_requirement:
  goal:
  actors:
  scope:
  requirements:
  business_rules:
  acceptance_criteria:
  open_questions:
```

Use `working_context` to preserve brownfield behavior and `product_requirement` to establish product intent. Do not derive a new truth model that conflicts with either input.

## Responsibilities

### 1. Determine functional scope

Identify only the behavior that changes and the existing behavior directly affected by that change.

Distinguish internally between:

- `changed`: behavior introduced, modified, or removed by the request;
- `affected`: existing behavior whose semantics or result are influenced by the change;
- `unaffected`: nearby behavior that should not be re-documented unless needed to remove ambiguity.

Avoid rewriting the entire existing feature when the request changes only a bounded slice.

### 2. Define behavior contracts

For each relevant behavior, establish:

- actor;
- trigger;
- preconditions when material;
- system response;
- resulting functional state or observable result;
- directly related product/business rules;
- unresolved questions that affect this behavior.

A behavior contract should answer:

`WHO -> WHEN -> CAN DO WHAT -> SYSTEM DOES WHAT -> WHAT BECOMES TRUE AFTERWARD`

### 3. Establish relevant state model

Capture only states necessary to explain the functional behavior.

Distinguish when useful between:

- feature states, such as `unfiltered`, `filtered`, or `empty-result`;
- operation states, such as `idle`, `loading`, or `error`.

Record meaningful transitions when a trigger changes one functional state into another. Do not create exhaustive state machines without evidence or need.

### 4. Apply rules and invariants

Convert confirmed business/product rules into functional rules that remain true while the behavior executes.

Examples include eligibility constraints, composition rules between active criteria, or persistence of existing behavior.

Keep technical architecture, framework, library, caching, state-management, and coding conventions outside this capability.

### 5. Reconcile interaction with existing behavior

Brownfield changes often modify the semantics of existing behavior. Identify those relationships explicitly.

Describe behavioral relationships, not code dependencies. For example, a new location filter may compose with keyword search and alter the result set over which pagination operates.

### 6. Cover relevant scenarios

Use scenarios as coverage for the behavioral contract after the model is established, not as an invitation to brainstorm speculative edge cases.

Use only relevant categories:

- primary scenario;
- alternative valid scenario;
- exceptional/failure scenario when supported by evidence or necessary to make the behavior deterministic.

Do not invent speculative cases such as multi-tab races, offline behavior, future admin flows, or other possibilities unless source, existing docs, prompt, or direct logical consequence establishes them as relevant.

### 7. Capture functional validation when applicable

Document input or condition constraints only when they change observable functional behavior.

Functional validation is not API/schema implementation detail.

### 8. Capture functional permissions when applicable

Describe role/actor differences only when they change what behavior is available. Do not describe authorization architecture or RBAC implementation.

### 9. Capture observable side effects when applicable

Record secondary outcomes that are visible or meaningful at the functional level. Exclude technical side effects such as cache invalidation or state-library operations.

### 10. Preserve unresolved questions without blocking unrelated work

If one behavior is uncertain, continue authoring every unaffected behavior and record the uncertainty against the exact scope it affects.

Do not halt the entire specification for a localized ambiguity.

## Output contract

Return a structured draft equivalent to:

```yaml
functional_spec:
  feature:

  scope:
    changed: []
    affected: []

  actors: []

  behaviors:
    - id:
      name:
      actor:
      trigger:
      preconditions: []
      system_response: []
      result: []
      related_rules: []
      open_questions: []

  states:
    feature: []
    operation: []

  transitions:
    - from:
      trigger:
      to:

  functional_rules: []

  behavior_relationships:
    - behaviors: []
      relationship:

  scenarios:
    primary: []
    alternative: []
    exceptional: []

  validation_behaviors: []
  functional_permissions: []
  observable_side_effects: []

  open_questions:
    - question:
      affects: []
```

Do not populate sections merely because they exist in the contract. Use only sections supported by the current scope.

## Internal process

1. determine functional scope;
2. identify changed and affected behaviors;
3. define behavior contracts;
4. establish relevant states and transitions;
5. apply confirmed business/functional rules;
6. reconcile interactions with existing behavior;
7. cover relevant scenarios;
8. capture validation, permissions, and observable side effects when applicable;
9. attach unresolved questions to the affected scope;
10. return the Functional Specification draft.

## Boundary

This capability owns behavioral specification only.

Use this test:

- `What can the user/system do, and how must the system respond?` -> Functional Specification.
- `Where does it appear, what does it look like, and how is the interaction presented?` -> UI/UX Specification.
- `How is it coded, structured, or implemented?` -> outside this document capability.

Examples:

- `User can clear the location filter.` -> functional;
- `Clearing the filter restores unfiltered results.` -> functional;
- `The clear action uses an X icon.` -> UI/UX;
- `The icon appears inside the select field.` -> UI/UX;
- `The filter uses React state or TanStack Query.` -> implementation.
