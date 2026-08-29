---
name: plan-frontend-work
description: Internal Orchestrator capability for creating, resuming, delivering, or safely pausing Jira-backed frontend work. This is not a user-facing workflow and must not be invoked directly by the user.
---

# Plan Frontend Work

Internal capability owned by Orchestrator.

## 1. Select lifecycle mode and execution intent

Use both values supplied by the primary workflow:

- lifecycle `planning`: new work or approved replanning;
- lifecycle `resume`: continue an existing specialist Subtask without repeating Brain analysis/decomposition;
- lifecycle `pause`: stop active work safely by reconciling Jira and producing a durable handoff decision;
- execution intent `plan-only`: create/reconcile the Jira task graph and stop before specialist execution;
- execution intent `deliver`: continue from a valid task graph into dependency-ready specialist execution without an artificial confirmation gate.

Lifecycle and execution intent are separate. Never interpret `planning` as automatically meaning `plan-only`.

Orchestrator owns workflow decisions only. The Primary Controller owns native child-agent lifecycle and Jira connector transport. Never call Jira or native agent lifecycle APIs directly from this capability.

When a Jira call or specialist execution is required, emit an exact `controller-action` in the reconciliation report and use `status: awaiting-controller`. Continue in the same Orchestrator child after the Primary Controller supplies the confirmed action result.

A tool missing inside the Orchestrator child is not evidence that the workflow capability is unavailable. Treat Jira or native dispatch as unavailable only after the Primary Controller returns a failed transport result.

## 2. Planning mode

Read the approved analysis package, [task-graph.md](references/task-graph.md), supplied Jira context, and only relevant project evidence needed to make Jira work executable.

Decompose in this order:

```text
requirement -> functional slices -> parent Tasks -> required specialist Subtasks
```

Decide the Jira Feature context first, then parent Tasks, then specialist Subtasks. Human-facing Jira content must be Vietnamese. Store common context once at Feature level, functional deltas at Task level, and execution deltas at Subtask level.

Request all required Jira reads/creates/updates through exact `jira-call` controller actions. Do not assume a mutation succeeded until the Primary Controller returns connector confirmation.

### Capability routing

Use the analysis package's `implementation-environment` plus current source evidence and the Subtask trigger to select the smallest allowed internal-capability set for each specialist.

Rules:

- detection is not dependency-adoption authority;
- do not default to shadcn, Lucide, MUI, HeroUI, Zustand, TanStack Query, or another package when evidence is missing;
- route a capability only when the specialist manifest allows it and the Subtask actually needs it;
- persist only compact capability identifiers/paths needed for deterministic resume;
- mark unresolved/conflicting stack decisions as a blocker/replan input instead of guessing.

Do not reopen Brain decisions. Route requirement, scope, architecture, dependency-adoption, or acceptance conflicts back to Brain/user as `replan` evidence.

After the Jira task graph is confirmed valid:

- `plan-only` -> return the confirmed hierarchy and stop before specialist dispatch;
- `deliver` -> continue immediately by emitting the next dependency-ready `dispatch-specialist` controller action. Do not ask for user confirmation merely because planning completed.

## 3. Resume mode

Do not rebuild the task graph and do not read all `.docs/`.

Load only:

1. current specialist Subtask;
2. parent functional Task;
3. Feature context;
4. direct completed dependencies and latest durable result/handoff evidence;
5. routed internal-capability identifiers for the Subtask;
6. relevant current source/provider state.

Read [handoff-contracts.md](references/handoff-contracts.md), compose one transient `issue-handoff`, and emit one `dispatch-specialist` controller action for the specialist required by the current Subtask.

Revalidate capability routing only against cheap current source/config evidence. If relevant architecture/dependency evidence changed materially, return `replan`; do not silently swap libraries during resume.

A new chat or developer handoff is not a reason to rerun Brain or planning when Jira context remains valid.

## 4. Pause mode

Pause is a workflow exit gate, not a normal specialist assignment.

When the Primary Controller supplies `pause`:

1. Freeze new specialist dispatch decisions. Do not request new Design, Test Plan, Coding, Testing, or Brain work.
2. Consume only active/incomplete Subtasks, parent Task/Feature context, available specialist reports, runtime cleanup evidence, latest durable results/handoffs, and relevant current source identity/state supplied by the controller.
3. Reconcile execution truth without inventing progress.
4. Request any proven missing `[RESULT]` notes and stale-status corrections through exact `jira-call` controller actions.
5. Determine one continuation point for remaining work. Do not create a new Task merely to represent the pause.
6. Build one transient object matching `.protocols/pause-checkpoint.yaml`.
7. Serialize that checkpoint into one concise Vietnamese `[HANDOFF]` Jira note as defined in [handoff-contracts.md](references/handoff-contracts.md), then request that write through a `jira-call` controller action.
8. Return `status: paused` only after the Primary Controller confirms the durable handoff and no unresolved runtime cleanup remains.

If all executable work is already proven complete, request missing `[RESULT]`/status updates and return the workflow ready for acceptance instead of inventing an unfinished handoff.

If a required Jira call fails, reason over the exact controller result. Return `pause-blocked` when the durable handoff cannot be confirmed.

## 5. Coordinate execution

- Start only dependency-ready Subtasks by emitting `dispatch-specialist` controller actions.
- Avoid parallel writes to the same source or public contract.
- Compose each `issue-handoff` with only the internal capabilities selected for that Subtask.
- Validate each confirmed specialist result against its Subtask scope and required evidence.
- Request Jira updates through `jira-call` controller actions before unblocking dependent work.
- Consume Primary Controller runtime-resource/child-close evidence; do not execute process cleanup or child lifecycle operations here.
- Use concise `[RESULT]`, `[BLOCKER]`, `[REVISION]`, or `[HANDOFF]` notes only when durable execution evidence is needed.
- Never write runtime state, handoff files, artifacts, or reports into `.plans/`, `.progresses/`, `.agent/`, or another product-repository workflow folder.

Never perform missing specialist work as a fallback.

## 6. Reconcile

Compare confirmed specialist results with their Jira Subtasks and parent acceptance boundaries.

- If a Jira operation or specialist dispatch is required next, return one YAML object matching `.protocols/reconciliation-report.yaml` with `status: awaiting-controller` and the exact `controller-actions`.
- Use `completed` only when the requested executable scope and required evidence are complete and no controller action remains pending.
- Use `paused` only after a required durable handoff has been confirmed.
- Use `revision-required` for recoverable gaps.
- Use `blocked`, `runtime-capability-blocked`, `runtime-cleanup-blocked`, or `pause-blocked` only from confirmed evidence/results rather than missing child-local tools.
