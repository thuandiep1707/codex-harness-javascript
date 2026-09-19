---
name: manage-jira-work
description: Internal Scrum Master capability for creating, reconciling, reading, and durably updating Jira-backed frontend work. This is not a user-facing workflow.
---

# Manage Jira Work

Internal capability owned by Scrum Master.

## 1. Operation boundary

Operate only in the operation supplied by Main:

- `planning`: create or reconcile a new Jira work graph from an approved analysis package;
- `replan`: update only the affected Jira graph delta from approved revalidation input;
- `resume-sync`: read the minimal current Jira state needed for execution resume;
- `progress-sync`: persist confirmed durable specialist result/blocker/revision/status evidence;
- `pause`: persist the supplied durable pause checkpoint and handoff;
- `finalize`: perform final Jira completion mutations authorized by current accepted Brain evidence.

Scrum Master owns Jira work management only. Do not dispatch specialists, select their internal capabilities, manage runtime resources, or perform product/test/design work.

## 2. Planning and replan

Use the approved analysis package and apply the task-decomposition rule before creating or changing Jira Tasks.

Decompose in this order:

```text
requirement
-> user outcomes
-> functional slices
-> parent Jira Tasks
-> required specialist Subtasks
```

Store common context once at Feature level, functional-slice delta at Task level, and specialist execution delta at Subtask level.

Create only independently actionable specialist Subtasks actually required by evidence. Record the intended specialist role when known, but do not dispatch that role and do not select internal capability packages.

Call Jira directly for required reads/creates/updates. Treat a mutation as confirmed only after connector success.

## 3. Resume sync

Do not repeat decomposition and do not read all product documentation.

Load only the minimum Jira chain required by the request:

1. requested current Subtask when applicable;
2. parent Task;
3. Feature context;
4. direct dependencies;
5. latest durable result/handoff evidence;
6. context/version validity markers required by Main.

Return a compact work graph and current state. Do not echo full descriptions when keys/status/dependencies are sufficient.

## 4. Progress sync

Persist only confirmed durable evidence supplied by Main.

Allowed durable categories:

- final `[RESULT]`;
- real `[BLOCKER]`;
- material `[REVISION]`;
- confirmed scope/status changes.

Do not reinterpret specialist evidence, acceptance coverage, validation results, runtime cleanup, or source changes. Main owns those orchestration decisions.

## 5. Pause

Consume the supplied proven pause checkpoint and persist only the required durable continuation state.

Write one concise `[HANDOFF]` for unfinished scope when required. Do not manufacture work, progress, blockers, or a new Task solely for pause.

## 6. Finalize

Use only after receiving a current Brain acceptance report with `status: accepted` for the target context.

Perform only the Jira completion mutations authorized for that accepted scope. Never infer acceptance from completed Subtasks or green tests.

## 7. Report

Return exactly one object matching `.protocols/jira-work-report.yaml`.

Keep it compact:

- Jira keys;
- statuses;
- dependencies;
- target roles;
- runnable/blocked/completed Subtask identifiers when relevant;
- confirmed/failed mutations;
- blockers/revisions.

Do not duplicate full Jira content or hidden reasoning into the report.
