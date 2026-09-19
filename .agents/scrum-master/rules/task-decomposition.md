# Task decomposition gate

Apply this rule before Jira Task creation for new or replanned work.

## Decomposition order

Always decompose in this order:

```text
requirement
-> user outcomes
-> functional slices
-> parent Jira Tasks
-> required specialist Subtasks
```

Never start by splitting work into `design`, `test-plan`, `coding`, and `testing`. Specialist role is a routing decision after functional Tasks exist.

## Parent Task contract

A parent Task must represent one cohesive user-observable or independently acceptable functional slice. It is a scope and acceptance boundary, not a specialist execution unit.

A Task is valid only when it has:

- one primary outcome;
- one cohesive behavior boundary;
- a bounded acceptance boundary;
- explicit included and excluded scope;
- dependencies that do not hide another independently completable behavior.

Split again when two behaviors can reasonably be completed or accepted independently. A title with multiple independent actions joined by "và" is a warning to re-check granularity.

Do not split primarily by file, component, hook, API helper, or technical layer. Those are implementation details unless they independently deliver an approved functional outcome.

## Specialist Subtasks

Only Subtasks are executable by specialists. For each parent Task create only specialist Subtasks actually required by evidence.

Do not create empty or fake specialist Subtasks merely to make every Task have the same shape. When a specialist category is unnecessary, omit it and record the reason on the parent Task when that reason would otherwise be ambiguous.

Scrum Master may record the intended specialist role for a Subtask but does not dispatch that specialist and does not select its internal capability packages.

## Final granularity check

Before any Jira mutation, reject and split any proposed Task that is effectively a whole feature, contains multiple independently acceptable user outcomes, or would require one coding specialist to own several unrelated presentation/business responsibilities.
