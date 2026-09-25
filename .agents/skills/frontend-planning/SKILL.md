---
name: frontend-planning
description: Analyze frontend requirements and create or reconcile a Jira work graph from semantic functional slices and specialist execution units, mapped to the current project schema, then stop before specialist implementation. Use when the user wants planning/decomposition only and explicitly does not want coding/testing to start yet.
---

# Frontend Planning Workflow

This is a user-facing planning-only workflow. Main is the runtime Orchestrator.

## Scope

1. Main resolves the working product repository, execution intent `plan-only`, and current Jira-backed lifecycle entry.
2. Main dispatches Brain for requirement analysis, authority readiness, and lightweight project-stack discovery when `NEW` or `REPLAN` requires it.
3. Capture Brain result, close/verify Brain, and continue only when `analysis-status: ready` and `authority.status: ready`.
4. Main dispatches Scrum Master with operation `planning` or `replan`, execution intent `plan-only`, and the approved analysis.
5. Scrum Master discovers the current Jira project schema, resolves semantic work roles to actual Jira work types/fields/relationships, creates or reconciles the Jira work graph, and returns compact `jira-work-report`.
6. Main closes/verifies Scrum Master and validates that the returned work graph is usable for later execution/resume.
7. Stop before Design, Test Plan, Coding, Testing Logic, or Testing UI execution.

## Planning rules

- Decompose `requirement -> user outcomes -> functional slices -> specialist execution units`.
- Treat `work-container` as optional grouping/context, not a required Jira issue type.
- Resolve actual Jira work types, fields, options, relationships, and workflow states from the current project schema.
- Do not split primarily by files, components, hooks, technical layers, or agent roles.
- Human-facing Jira content must be Vietnamese; technical identifiers remain exact.
- Detect project implementation stack from evidence; detection is not permission to adopt a new dependency.
- Record unresolved technology/architecture decisions instead of defaulting to a library.
- Main owns workflow/lifecycle decisions and child dispatch. Scrum Master alone owns Jira decomposition/schema-resolution/mutation for this workflow.

## Output

Return the created or updated Jira work graph, resolved semantic-role/work-type mappings, dependencies, acceptance boundaries, detected implementation-environment evidence, and unresolved decisions.

The workflow ends after planning by design.
