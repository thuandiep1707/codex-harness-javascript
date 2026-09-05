# Document Analysis

Internal document capability. Do not expose this package as a user-facing `$` workflow.

## Goal

Build one unified working context for document authoring from an existing project. The capability analyzes current implementation, relevant existing documentation, and the developer prompt before downstream authoring begins.

This capability is intentionally coarse-grained. Source discovery, reconciliation, gap identification, and uncertainty collection are internal responsibilities, not separate capabilities.

## Inputs

Use three evidence sources when available:

1. current source code;
2. relevant existing documents, commonly under locations such as `analysis/`, `analytic/`, `docs/`, or equivalent project-specific documentation paths;
3. the developer prompt describing the requested change or intent.

Inspect only the relevant scope needed for the requested work. Do not scan the entire repository by default.

## Responsibilities

- establish current implemented behavior from source;
- recover existing product/design intent and historical context from relevant documents;
- capture the newest requested intent from the developer prompt;
- reconcile the three sources before any document section is authored;
- identify the meaningful delta between current state and requested state;
- collect unresolved questions without interrupting work that can continue;
- produce one normalized working context for downstream document capabilities.

## Internal process

```text
read relevant source
+ read relevant existing docs
+ read developer prompt
        ↓
reconcile evidence
        ↓
identify current state + requested delta
        ↓
collect unresolved uncertainties
        ↓
unified working context
```

## Output contract

Return a compact analysis package with these logical sections:

```yaml
current_state:
  ...

existing_intent:
  ...

requested_change:
  ...

conflicts:
  ...

change_map:
  keep: []
  change: []
  add: []
  remove: []

uncertainties:
  ...

working_context:
  ...
```

Downstream document authoring must use `working_context` rather than independently re-reading one source and composing from it in isolation.

## Boundaries

This capability does not author the final Product / Feature Requirement, Functional Specification, or UI / UX Design Specification. It also does not select architecture, packages, libraries, coding conventions, API contracts, or data models.

Load and follow the local rules in `rules/` for source reconciliation, deferred clarification, and anti-overthinking behavior.
