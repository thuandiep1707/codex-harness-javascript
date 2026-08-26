# Task graph

Build the Jira graph around functional work, not agent roles.

## Hierarchy

```text
Feature context
  -> Task: one functional slice
      -> Subtask: one specialist execution unit
```

### Feature context

Store common objective, approved constraints, shared architecture direction, global acceptance scope,
`analysis: ready`, `task-tree: ready`, `context-version`, and `docs-baseline` once at Feature level.

### Parent Task

Represent one cohesive user-observable or independently acceptable behavior. Include only the delta
from Feature context: objective, included/excluded scope, acceptance criteria, and functional
dependencies.

A parent Task is never assigned directly to a specialist.

### Specialist Subtask

Represent one bounded execution unit for exactly one target agent. Include only the execution delta:
agent role, exact objective, allowed source/provider scope, direct dependencies, required evidence,
validation, and expected structured result.

Create only required specialist Subtasks; do not force every Task to contain all four roles.

## Dependency and parallelism rules

- A Design and Test Plan Subtask may run in parallel only when independent.
- Coding waits only for the direct approved design/contract evidence it actually requires.
- Testing waits for its required test-plan evidence and relevant production contract.
- Parallelize only disjoint write surfaces and independent public contracts.
- Record omission reasons when a normally expected specialist is intentionally unnecessary and the
  reason is not obvious from the Task.

## Resume graph

Resume does not rebuild this graph. Resolve only:

```text
current Subtask
  <- parent Task
      <- Feature context
+ direct dependencies
+ latest durable result/handoff
```

Do not load unrelated siblings, completed branches, full sprint history, or all Jira comments merely
to continue one Subtask.
