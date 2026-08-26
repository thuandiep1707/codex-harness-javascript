---
name: frontend-planning
description: Analyze frontend requirements and create the Jira Feature, functional Tasks, and required specialist Subtasks, then stop before specialist implementation. Use when the user wants planning/decomposition only and explicitly does not want coding/testing to start yet.
---

# Frontend Planning Workflow

This is a user-facing planning-only workflow.

## Scope

1. Resolve the working product repository and Jira context.
2. Spawn Brain for requirement analysis and lightweight project-stack discovery when new/replan work requires it.
3. Spawn Orchestrator in planning/replanning mode.
4. Create/update the Jira Feature context, functional Tasks, and only the specialist Subtasks actually required.
5. Persist machine-readable validity metadata and human-facing Jira content.
6. Stop after the Jira work graph is valid.

Do not dispatch Design, Test Plan, Coding, or Testing specialists in this workflow.

## Planning rules

- Decompose `requirement -> user outcomes -> functional slices -> Tasks -> specialist Subtasks`.
- Do not split primarily by files, components, hooks, or agent roles.
- Human-facing Jira content must be Vietnamese; technical identifiers remain exact.
- Detect project implementation stack from evidence; detection is not permission to adopt a new dependency.
- Record unresolved technology/architecture decisions instead of defaulting to a library.

## Output

Return the created/updated Jira hierarchy, dependencies, acceptance boundaries, detected implementation-environment evidence, and unresolved decisions. The workflow ends after planning by design.
