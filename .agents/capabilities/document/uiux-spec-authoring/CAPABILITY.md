# UI/UX Specification Authoring

Internal document capability. Do not expose this package as a user-facing `$` workflow.

## Purpose

Transform normalized document context, product requirements, and functional behavior into a UI/UX Specification draft that explains how confirmed behavior is exposed, perceived, and operated through the interface.

This capability answers one question: how does the user see and interact with the functional behavior?

It does not choose implementation libraries, framework architecture, component packages, CSS techniques, or technical structure.

## Input contract

Consume:

- `working_context` from `document/analysis`;
- `product_requirement` from `product-requirement-authoring`;
- `functional_spec` from `functional-spec-authoring`.

Use them for distinct purposes:

- working context establishes relevant current UI and the requested delta;
- product requirement establishes product intent;
- functional specification establishes behavior and state that the UI must expose.

## Responsibilities

### 1. Determine UI scope

Document only interface areas that are changed, affected, or explicitly preserved by the requested scope. Do not redesign the whole screen for a localized change.

Represent scope conceptually as:

```yaml
ui_scope:
  changed: []
  affected: []
  preserved: []
```

### 2. Define required UI structure

Identify the interface elements or surfaces required to expose confirmed behavior. Describe their role, not their implementation library or code structure.

### 3. Map behavior to interaction

Translate functional behavior into an interaction contract covering where the user accesses the behavior, what action they perform, what feedback becomes visible, and what result follows.

### 4. Map functional states to observable UI states

Describe how relevant functional states become perceivable to the user, such as filtered, loading, empty-result, or error states. Do not invent visual details such as colors, skeleton counts, illustrations, or styling unless they are already established by source, existing docs, or developer intent.

### 5. Define responsive behavior when it materially changes access or interaction

Record viewport-specific behavior only when relevant to the requested scope. If presentation differs but is unresolved, preserve it as an open question instead of inventing a drawer, sheet, modal, or other presentation pattern.

### 6. Preserve relevant existing UI

Record current interface behavior or structure that must remain unchanged when it is directly related to the requested delta. This prevents small brownfield changes from expanding into accidental redesigns.

### 7. Preserve unresolved UI/UX questions without blocking unaffected work

Continue authoring all sections that do not depend on an unresolved decision. Carry unresolved UI/UX questions forward with the scope they affect.

## Output contract

Return a structured draft equivalent to:

```yaml
uiux_spec:
  feature:

  ui_scope:
    changed: []
    affected: []
    preserved: []

  ui_structure: []

  interactions:
    - id:
      entry_point:
      action:
      feedback:
      result:

  ui_states:
    - state:
      visible_behavior:

  responsive_behavior: []

  preserve_existing_ui: []

  open_questions:
    - question:
      affects: []
```

Do not create empty detail sections merely because a generic UI/UX template could contain them. Add detail only when the current scope requires it.

## Internal process

Use this authoring sequence:

1. determine affected UI scope;
2. identify the UI structure needed to expose confirmed behavior;
3. map functional behavior to user interactions;
4. map functional states to observable UI states;
5. record relevant responsive behavior;
6. preserve directly related existing UI;
7. attach unresolved UI/UX questions to the affected scope;
8. return the UI/UX Specification draft.

## Boundary

This capability owns UI/UX behavioral specification only.

It does not own:

- product intent definition;
- system behavior definition;
- source/doc/prompt reconciliation;
- visual design invention;
- component/library selection;
- framework or architecture decisions;
- CSS/layout implementation;
- technical implementation planning.

A useful boundary test is:

- if a statement remains true after removing all interface presentation, it likely belongs to Functional Specification;
- if it explains how the user perceives, accesses, or operates that behavior, it belongs to UI/UX Specification;
- if it explains how code implements the behavior, it is outside this document capability.
