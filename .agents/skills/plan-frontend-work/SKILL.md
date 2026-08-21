---
name: plan-frontend-work
description: Convert an approved frontend analysis package into a dependency-ordered Jira Task/Subtask graph, bounded runtime handoffs, specialist waves, and a reconciliation report. Use only for the Orchestrator after Brain analysis; do not use for requirement analysis, architecture ownership decisions, product implementation, visual design, test planning, test implementation, or final acceptance.
---

# Plan Frontend Work

## 1. Validate inputs and capabilities

Read the analysis package, protocol templates, agent manifests, and only the project documents or
source evidence needed to make Jira work executable. Verify Jira before external mutation. Return a
`missing-capability` blocker if it is unavailable.

Do not reopen Brain decisions. Send requirement, scope, architecture, or acceptance conflicts back
to Brain or the user.

## 2. Build the Jira Task/Subtask graph

Read [task-graph.md](references/task-graph.md).

Use this hierarchy consistently:

```text
Task = one bounded functional slice / user-visible outcome
└── Subtask = one executable specialist work unit
```

Every Task must contain at least one Subtask. Parent Tasks are containers and are never assigned to a
specialist. Split work until every Subtask has one target specialist, one cohesive objective, bounded
scope/write surface, explicit dependencies, and independently checkable acceptance/validation.

Use specialist categories as needed:

1. `design`;
2. `test-plan`;
3. `coding`;
4. `testing`.

A category may produce multiple Subtasks. In particular, do not create one giant `coding` Subtask for
an entire feature when UI sections, routes/screens, data responsibilities, or interactions can be
implemented and reviewed independently.

Record why any category is omitted. Make dependencies, write surfaces, execution waves, and exit
conditions explicit in Jira.

## 3. Create Jira work and runtime handoffs

Read [handoff-contracts.md](references/handoff-contracts.md).

Create or update the parent Task first, then its Subtasks. All Jira content created by agents must be
written in Vietnamese, including title, description, scope, acceptance criteria, dependency notes,
blockers, progress comments, and completion summaries. Keep code identifiers, file paths, API names,
framework/library names, and standard technical terms in their original technical form when
translation would reduce precision.

Build one runtime `issue-handoff.yaml` payload per Subtask and pass it directly to the assigned
specialist. Do not persist handoffs, task graphs, progress, or workflow state into the working
repository. Never create `.agent/`, `.plan/`, `.progresses/`, or equivalent workflow-tracking folders.

Do not pass raw `.docs/`, document paths, the original user prompt, hidden reasoning, or another
agent's rules/skills to a specialist.

## 4. Coordinate specialist waves

- Run `design` and `test-plan` Subtasks in the preparation wave when required and parallel-safe.
- Validate returned YAML artifacts before unblocking dependent Subtasks.
- Start each `coding` Subtask only after its required design artifact exists.
- Start each `testing` Subtask only after its test-plan artifact and relevant production contract are
  available.
- Avoid parallel writes to the same files or public contract.
- Update Jira after every meaningful transition, blocker, validation result, and completion event.

Never perform missing specialist work as a fallback.

## 5. Reconcile

Compare every specialist report with its assigned Jira Subtask and runtime handoff. Update Jira so
Task/Subtask state matches the actual evidence, then return YAML matching
`.protocols/reconciliation-report.yaml`.

Use `completed` only when every required Subtask and artifact is complete. Use `revision-required`
for recoverable scope or evidence gaps and `blocked` for missing capabilities or unresolved authority.
