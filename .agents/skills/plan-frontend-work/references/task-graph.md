# Jira Task/Subtask graph

Use Jira as the only durable representation of execution planning and progress.

## Hierarchy

```text
Task = one bounded functional slice / user-visible outcome
└── Subtask = one executable specialist work unit
```

Every parent Task must contain at least one Subtask. Parent Tasks are planning containers and must not
be assigned directly to a specialist.

Represent every Subtask with:

- Subtask ID and Jira issue key;
- parent Task key;
- target agent;
- one bounded objective;
- included and excluded scope;
- dependencies and required runtime artifacts;
- allowed source paths and forbidden `.docs/**`;
- acceptance criteria and required validation;
- required capabilities;
- expected YAML outputs;
- status and write surface.

## Mandatory split rules

Split a parent Task when it contains more than one independently deliverable user outcome.

Split a candidate Subtask when any of these is true:

- it has more than one independently reviewable implementation responsibility;
- it spans multiple routes/screens that can be implemented or validated separately;
- it combines unrelated presentation, data-access, state-management, or integration responsibilities;
- it has multiple write surfaces that can progress independently;
- a meaningful portion could be completed, reviewed, or reverted without the rest;
- the acceptance criteria describe multiple independent outcomes rather than one cohesive result.

For UI work, prefer multiple bounded Coding Subtasks over a feature-sized Coding Subtask. A single
Subtask may touch several files when they form one cohesive responsibility, but belonging to the same
feature is not sufficient reason to bundle independent responsibilities.

## Waves

Use two default waves:

```text
preparation: design + test-plan Subtasks
implementation: bounded coding Subtasks -> testing Subtasks
```

Parallelize only independent Subtasks with disjoint write surfaces. A test-plan Subtask may run beside
a design Subtask. Testing depends on the approved test plan and the relevant production contract.

Record omission reasons in Jira when design or test planning is unnecessary. Never omit a role merely
because its capability is missing; mark the affected Subtask/workflow blocked instead.

Do not persist a local task graph, plan file, progress file, or workflow-state mirror in the working
repository.
