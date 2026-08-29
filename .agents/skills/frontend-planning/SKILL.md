---
name: frontend-planning
description: Analyze frontend requirements and create the Jira Feature, functional Tasks, and required specialist Subtasks, then stop before specialist implementation. Use when the user wants planning/decomposition only and explicitly does not want coding/testing to start yet.
---

# Frontend Planning Workflow

This is a user-facing planning-only workflow.

## Scope

1. Resolve the working product repository and Jira context in the Primary Controller.
2. Spawn Brain for requirement analysis and lightweight project-stack discovery when new/replan work requires it; capture the result, then close/verify the Brain child.
3. Spawn one Orchestrator child in planning/replanning mode and supply the approved analysis plus Jira context.
4. Orchestrator decides the Jira Feature/Task/Subtask operations and returns exact `jira-call` controller actions; it does not call Jira directly.
5. Primary Controller executes those Jira calls exactly, returns confirmed results to the same Orchestrator child, and repeats until the Jira work graph is valid.
6. Capture the final planning result, then close/verify the Orchestrator child.
7. Stop before specialist implementation.

Do not dispatch Design, Test Plan, Coding, or Testing specialists in this workflow.

## Planning rules

- Decompose `requirement -> user outcomes -> functional slices -> Tasks -> specialist Subtasks`.
- Do not split primarily by files, components, hooks, or agent roles.
- Human-facing Jira content must be Vietnamese; technical identifiers remain exact.
- Detect project implementation stack from evidence; detection is not permission to adopt a new dependency.
- Record unresolved technology/architecture decisions instead of defaulting to a library.
- Only the Primary Controller invokes the Jira connector and native child-agent lifecycle APIs. Orchestrator owns planning decisions only.

## Output

Return the created/updated Jira hierarchy, dependencies, acceptance boundaries, detected implementation-environment evidence, and unresolved decisions. The workflow ends after planning by design.
