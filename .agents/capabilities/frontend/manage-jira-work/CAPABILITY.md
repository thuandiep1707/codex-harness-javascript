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
- `progress-sync`: persist confirmed durable specialist result/blocker/revision/workflow-state evidence;
- `pause`: persist the supplied durable pause checkpoint and handoff;
- `finalize`: perform final Jira completion mutations authorized by current accepted Brain evidence.

Scrum Master owns Jira work management only. Do not dispatch specialists, select their internal capabilities, manage runtime resources, or perform product/test/design work.

## 2. Resolve Jira schema before mutation

Apply `.agents/scrum-master/rules/jira-schema-discovery.md`.

For create/replan:

1. discover issue/work types available in the target project;
2. map semantic work roles (`work-container`, `functional-slice`, `execution-unit`) to supported Jira work types/relationships;
3. discover all create fields for each selected project + work type;
4. resolve workflow semantics to actual field/value pairs;
5. mutate Jira only after required work types, fields, relationships, and values are resolved.

For existing-item edits:

1. inspect only the editable field metadata needed for the requested update;
2. validate field type/value against current metadata;
3. inspect current valid transitions before a workflow-state change.

Reuse discovered create metadata within the current invocation for the same `project + work type`. Do not persist the cache.

## 3. Planning and replan

Use the approved analysis package and apply the work-decomposition rule before creating or changing Jira work.

Decompose in this order:

```text
requirement
-> user outcomes
-> functional slices
-> execution units
```

Create a work-container only when the current Jira/project model needs or supports that grouping/context level.

Store common approved context at the resolved work-container level when present, functional outcome/scope delta at the functional-slice level, and specialist execution delta at the execution-unit level.

Create only independently actionable execution units actually required by evidence. Record the intended specialist role when known, but do not dispatch that role and do not select internal capability packages.

Represent project-specific metadata as semantic intent first, then resolve it through current Jira schema. Do not encode a project-specific work type, label, custom field, option, owner field, or status as a universal planning rule.

Call Jira directly for required reads/creates/updates. Treat a mutation as confirmed only after connector success.

## 4. Resume sync

Do not repeat decomposition and do not read all product documentation.

Load only the minimum Jira chain required by the request:

1. requested current execution unit when applicable;
2. its functional-slice boundary;
3. optional work-container context when present;
4. direct dependencies;
5. latest durable result/handoff evidence;
6. context/version validity markers required by Main, including analysis readiness, authority readiness, work-graph readiness, docs baseline, and relevant document references.

Return those markers in `jira-work-report.validity` together with the compact work graph/current state. Do not echo full descriptions when keys/workflow-state/dependencies are sufficient.

## 5. Progress sync

Persist only confirmed durable evidence supplied by Main.

Allowed durable categories:

- final `[RESULT]`;
- real `[BLOCKER]`;
- material `[REVISION]`;
- confirmed scope/workflow-state changes;
- mechanical execution-graph materialization explicitly authorized by Main from a confirmed Test Plan `testing-route`.

For Test Plan routing, create/reconcile only the required testing execution units for `logic`, `ui`, or `both`; create none for `none`. Preserve the parent functional slice and confirmed route exactly. Do not reclassify testing, invent extra testing work, or materialize speculative testing units before the Test Plan result exists.

Resolve any project-specific target field, work type, relationship, or workflow transition from current Jira metadata before mutation.

Do not reinterpret specialist evidence, acceptance coverage, validation results, runtime cleanup, or source changes. Main owns those orchestration decisions.

## 6. Pause

Consume the supplied proven pause checkpoint and persist only the required durable continuation state.

Write one concise `[HANDOFF]` for unfinished scope when required. Resolve any required project-specific field/workflow-state mutation from current Jira metadata first. Do not manufacture work, progress, blockers, or a new work item solely for pause.

## 7. Finalize

Use only after receiving a current Brain acceptance report with `status: accepted` for the target context.

Perform only the Jira completion mutations authorized for that accepted scope. Resolve the current valid transition to the project's terminal/completed workflow state before mutation. Never infer acceptance from completed execution units or green tests.

## 8. Report

Return exactly one object matching `.protocols/jira-work-report.yaml`.

Keep it compact:

- Jira keys;
- semantic work roles and resolved Jira work types;
- workflow states;
- dependencies;
- target roles;
- runnable/blocked/completed execution-unit identifiers when relevant;
- field resolutions actually used for mutations;
- confirmed/failed mutations;
- blockers/revisions;
- validity markers required for resume/replan decisions.

Do not duplicate full Jira content, full schema metadata, unused allowed-value lists, or hidden reasoning into the report.
