# Task decomposition gate

Apply this rule before requesting Jira Task creation for new or replanned work.

## Decomposition order

Always decompose in this order:

```text
requirement
-> user outcomes
-> functional slices
-> parent Jira Tasks
-> required specialist Subtasks
```

Never start by splitting work into `design`, `test-plan`, `coding`, and `testing`. Specialist role is a
routing decision after functional Tasks exist.

## Parent Task contract

A parent Task must represent one cohesive user-observable or independently acceptable functional
slice. It is a scope and acceptance boundary, not a specialist execution unit.

A Task is valid only when it has:

- one primary outcome;
- one cohesive behavior boundary;
- a bounded acceptance boundary;
- explicit included and excluded scope;
- dependencies that do not hide another independently completable behavior.

Split again when two behaviors can reasonably be completed or accepted independently. A title with
multiple independent actions joined by "và" is a warning to re-check granularity.

Do not split primarily by file, component, hook, API helper, or technical layer. Those are implementation
details unless they independently deliver an approved functional outcome.

## Specialist Subtasks

Only Subtasks are executable by specialists. For each parent Task decide only the specialist Subtasks
that are actually required by evidence, then request the corresponding Jira mutations through the
Primary Controller.

Examples:

```text
Task: Lọc người dùng theo vai trò
  -> Thiết kế trạng thái bộ lọc        # only when design work is required
  -> Lập kế hoạch kiểm thử bộ lọc     # only when separate test planning is required
  -> Triển khai bộ lọc người dùng
  -> Kiểm thử bộ lọc người dùng
```

Do not create empty or fake specialist Subtasks merely to make every Task have the same shape. When a
specialist category is unnecessary, omit it and record the reason on the parent Task when that reason
would otherwise be ambiguous.

## Final granularity check

Before emitting any Jira mutation request, reject and split any proposed Task that is effectively a whole
feature, contains multiple independently acceptable user outcomes, or would require one coding specialist
to own several unrelated presentation/business responsibilities.
