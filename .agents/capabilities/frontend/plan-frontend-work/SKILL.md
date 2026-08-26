---
name: plan-frontend-work
description: Create, resume, or safely pause Jira-backed frontend work from approved analysis and durable Jira context. Use only for the Orchestrator; do not perform requirement analysis, product implementation, visual design, test planning, test implementation, or final acceptance.
---

# Plan Frontend Work

## 1. Select mode

Use the workflow mode supplied by the primary controller.

- `planning`: new work or approved replanning.
- `resume`: continue an existing specialist Subtask from Jira without repeating Brain analysis or task decomposition.
- `pause`: stop active work safely by reconciling Jira and persisting a durable handoff before exit.

Verify Jira before any external mutation. Return `missing-capability` if it is unavailable. In `pause`
mode, stop new dispatch even when Jira is unavailable, but return `pause-blocked` rather than claiming
a durable pause.

## 2. Planning mode

Read the approved analysis package, [task-graph.md](references/task-graph.md), and only relevant
project evidence needed to make Jira work executable.

Decompose in this order:

```text
requirement -> functional slices -> parent Tasks -> required specialist Subtasks
```

Create Jira Feature context first, then parent Tasks, then specialist Subtasks. Human-facing Jira
content must be Vietnamese. Store common context once at Feature level, functional deltas at Task
level, and execution deltas at Subtask level.

Do not reopen Brain decisions. Route requirement, scope, architecture, or acceptance conflicts back to
Brain/user as `replan` evidence.

## 3. Resume mode

Do not rebuild the task graph and do not read all `.docs/`.

Load only:

1. current specialist Subtask;
2. parent functional Task;
3. Feature context;
4. direct completed dependencies and latest durable result/handoff evidence;
5. relevant current source/provider state.

Read [handoff-contracts.md](references/handoff-contracts.md), compose one transient
`issue-handoff`, and route only the specialist required by the current Subtask.

A new chat or developer handoff is not a reason to rerun Brain or planning when Jira context remains
valid.

## 4. Pause mode

Pause is a workflow exit gate, not a normal specialist assignment.

When the primary controller supplies `pause`:

1. Freeze dispatch. Do not spawn new Design, Test Plan, Coding, Testing, or Brain work.
2. Resolve only active/incomplete Subtasks, their parent Task/Feature context, available specialist
   reports, latest durable results/handoffs, and relevant current source identity/state.
3. If an active specialist can return a bounded current-state report, collect it. Do not wait
   indefinitely; after cancellation/timeout, use only proven source/report/Jira evidence.
4. Reconcile execution truth with Jira. Persist any proven missing `[RESULT]` notes and correct stale
   statuses before writing the handoff.
5. Determine one continuation point for remaining work. Do not create a new Task merely to represent
   the pause.
6. Build one transient object matching `.protocols/pause-checkpoint.yaml`.
7. Serialize that checkpoint into one concise Vietnamese `[HANDOFF]` Jira note as defined in
   [handoff-contracts.md](references/handoff-contracts.md).
8. Confirm the note is durably persisted, then return `status: paused` in the reconciliation report.

If all executable work is already proven complete, persist missing `[RESULT]`/status updates and do
not invent an unfinished handoff. Return the workflow ready for acceptance instead of `paused`.

## 5. Coordinate execution

- Start only dependency-ready Subtasks.
- Avoid parallel writes to the same source or public contract.
- Validate each returned structured result against its Subtask scope and required evidence.
- Update Jira before unblocking dependent work.
- Use concise `[RESULT]`, `[BLOCKER]`, `[REVISION]`, or `[HANDOFF]` notes only when durable execution
  evidence is needed.
- Never write runtime state, handoff files, artifacts, or reports into `.plans/`, `.progresses/`,
  `.agent/`, or another product-repository workflow folder.

Never perform missing specialist work as a fallback.

## 6. Reconcile

Compare returned specialist results with their Jira Subtasks and parent acceptance boundaries. Update
Jira and return one YAML object matching `.protocols/reconciliation-report.yaml`.

Use `completed` only when the requested executable scope and required evidence are complete. Use
`paused` only after a required durable handoff has been confirmed. Use `revision-required` for
recoverable gaps and `blocked`/`pause-blocked` for missing capability or unresolved authority.
